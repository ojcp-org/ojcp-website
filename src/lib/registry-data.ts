import fs from "fs";
import path from "path";

export interface RegistryProvider {
  domain: string;
  name: string;
  description: string;
  mcp_endpoint: string;
  manifest_url: string;
  industries: string[];
  location: { city?: string; state?: string; country: string };
  tools: string[];
  apply_paths: string[];
  has_agent_apply: boolean;
  verified: boolean;
  verified_at: string;
  registered_at: string;
}

function loadProviders(): RegistryProvider[] {
  const dir = path.join(process.cwd(), "registry", "providers");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(raw) as RegistryProvider;
  });
}

// Load once at module init (server-side). In standalone mode this reads
// from the filesystem at startup; in dev mode it re-reads on each request
// due to module reloading.
export const providers: RegistryProvider[] = loadProviders();
