import { Header, Footer } from "@/components";
import { Governance } from "@/components/Governance";

export const metadata = {
  title: "Governance — OJCP",
  description:
    "OJCP is governed by an independent 9-seat steering committee through a public RFC process, with infrastructure committed to transfer to a neutral foundation before v1.0.",
};

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
