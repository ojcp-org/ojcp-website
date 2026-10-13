# ── Stage 1: Install dependencies & build ──
# Single stage on purpose: the CI runner uses podman's `vfs` storage driver,
# which has no copy-on-write and snapshots the full filesystem for every layer.
# A separate deps stage + `COPY --from=deps node_modules` would duplicate the
# ~1GB of native deps (next-swc, sharp/libvips) on the pod's ephemeral disk and
# blow past its 10Gi limit. Installing and building in one RUN keeps the pnpm
# store ↔ node_modules hardlinks intact and minimises resident layer snapshots.
FROM core.harbor.recruitics.dev/dockerhub/library/node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile && pnpm build

# ── Stage 3: Production runtime ──
FROM core.harbor.recruitics.dev/dockerhub/library/node:24-alpine AS runner

# Fix CVE-2026-22184 / CVE-2026-27171 (zlib) and strip npm (CVE-2025-64756,
# CVE-2026-23745, CVE-2026-23950, CVE-2026-24842, CVE-2026-26960,
# CVE-2026-26996, CVE-2026-27903, CVE-2026-27904, CVE-2026-29786)
RUN apk upgrade --no-cache && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
