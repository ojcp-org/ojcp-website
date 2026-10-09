import { Header, Footer } from "@/components";
import { Registry } from "@/components/Registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/registry",
  title: "OJCP Registry — Discover Providers",
  description:
    "Browse and discover OJCP-compliant job data providers. Find employers and job boards that support agent-consumable job feeds.",
});

export default function RegistryPage() {
  return (
    <>
      <Header />
      <main>
        <Registry />
      </main>
      <Footer />
    </>
  );
}
