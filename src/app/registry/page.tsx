import { Header, Footer } from "@/components";
import { Registry } from "@/components/Registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/registry",
  title: "OJCP Registry — Providers and Evidence",
  description:
    "The OJCP registry lists job data providers that serve the Open Job Context Protocol, with evidence gathered daily: manifest facts and conformance results. A listing is not an endorsement.",
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
