# ── Stage 1: Install dependencies & build ──
# Install and build in one RUN: keeps the pnpm store ↔ node_modules hardlinks
# intact and avoids copying ~1GB of native deps (next-swc, sharp/libvips)
# between stages.
# Base image for both stages; override with --build-arg NODE_IMAGE=<mirror>.
ARG NODE_IMAGE=node:24-alpine
FROM ${NODE_IMAGE} AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile && pnpm build

# ── Stage 3: Production runtime ──
FROM ${NODE_IMAGE} AS runner

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
