import { OJCP_VERSION } from "./site";
import { providers, type RegistryProvider } from "./registry-data";

export interface FindProvidersInput {
  industry?: string;
  employer_name?: string;
  location?: string;
  has_agent_apply?: boolean;
}

export function findOjcpProviders(input: FindProvidersInput) {
  let results: RegistryProvider[] = [...providers];

  if (input.industry) {
    const q = input.industry.toLowerCase();
    results = results.filter((p) =>
      p.industries.some((i) => i.toLowerCase().includes(q))
    );
  }

  if (input.employer_name) {
    const q = input.employer_name.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (input.location) {
    const q = input.location.toLowerCase();
    results = results.filter((p) => {
      const loc = p.location;
      return (
        loc.country?.toLowerCase().includes(q) ||
        loc.state?.toLowerCase().includes(q) ||
        loc.city?.toLowerCase().includes(q)
      );
    });
  }

  if (input.has_agent_apply !== undefined) {
    results = results.filter((p) => p.has_agent_apply === input.has_agent_apply);
  }

  return {
    ojcp_version: OJCP_VERSION,
    total_results: results.length,
    providers: results,
  };
}
