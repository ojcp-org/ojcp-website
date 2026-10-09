import { Header, Footer } from "@/components";
import { Governance } from "@/components/Governance";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/governance",
  title: "Governance — OJCP",
  description:
    "OJCP is governed by an independent nine-seat steering committee, with a public proposal and a decision record behind every change.",
});

export default function GovernancePage() {
  return (
    <>
      <Header />
      <main>
        <Governance />
      </main>
      <Footer />
    </>
  );
}
