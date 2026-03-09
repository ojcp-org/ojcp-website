# ojcp.dev

The website and reference provider for the [Open Job Context Protocol](https://github.com/AustinRecs/ojcp) (OJCP).

## What This Is

This repo powers [ojcp.dev](https://ojcp.dev) — a marketing site, spec reference, and **live OJCP-compliant provider** that serves mock job data to AI agents. It dogfoods the protocol by implementing all five OJCP tools against realistic mock data.

### Live Endpoints

| Endpoint | Description |
|---|---|
| `/.well-known/ojcp.json` | OJCP manifest (discovery) |
| `/api/mcp` | MCP-compatible tool endpoint |
| `/api/tools` | REST wrapper for the playground |

### OJCP Tools Implemented

- **`search_jobs`** — Text search with location/salary filters and fit scoring
- **`get_job_detail`** — Full job detail with employer context
- **`get_employer_context`** — Employer culture, benefits, hiring practices
- **`begin_application`** — Initiate an application session
- **`check_application_status`** — Track application progress

### WebMCP

On Chrome 146+ with the WebMCP flag enabled, the site registers OJCP tools via `navigator.modelContext.registerTool()` so browser-native agents can discover and call them directly.

## Tech Stack

- [Next.js 16](https://nextjs.org/) + TypeScript + App Router
- [Mantine v8](https://mantine.dev/) — UI components
- [Zustand](https://zustand.docs.pmnd.rs/) + [Immer](https://immerjs.github.io/) — State management
- [Zod v4](https://zod.dev/) — Schema validation
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — MCP server
- [pnpm](https://pnpm.io/) — Package manager

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Connecting an MCP Client

Point any MCP client at the endpoint:

```
http://localhost:3000/api/mcp
```

Or test the manifest:

```bash
curl http://localhost:3000/.well-known/ojcp.json
```

## Project Structure

```
src/
  app/
    layout.tsx                  Root layout (Mantine + WebMCP)
    page.tsx                    Landing page
    .well-known/ojcp.json/
      route.ts                  OJCP manifest endpoint
    api/
      mcp/route.ts              MCP server (Streamable HTTP)
      tools/route.ts            REST tool wrapper
  components/
    Header.tsx                  Nav header
    Hero.tsx                    Hero section
    Features.tsx                Feature cards
    Spec.tsx                    Schema & tools overview
    HowItWorks.tsx              Timeline walkthrough
    CodeExamples.tsx            Tabbed code samples
    ApplyPaths.tsx              Apply path taxonomy table
    Playground.tsx              Interactive API playground
    Community.tsx               Get started / contribute
    Footer.tsx                  Footer
    WebMCPProvider.tsx           WebMCP tool registration
  lib/
    schemas.ts                  Zod schemas (mirrors OJCP JSON schemas)
    mock-data.ts                Mock jobs, employers, fit scoring
    ojcp-tools.ts               Tool handler implementations
    mcp-server.ts               MCP server factory
  store/
    index.ts                    Zustand + Immer store
  theme/
    index.ts                    Mantine theme (OJCP brand)
  types/
    webmcp.d.ts                 WebMCP TypeScript types
public/
  logos/                        12 SVG logo variants
```

## Related

- [OJCP Spec](https://github.com/AustinRecs/ojcp) — The protocol specification, schemas, and examples
