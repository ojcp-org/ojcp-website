import { Header, Footer } from "@/components";
import { About } from "@/components/About";

export const metadata = {
  title: "About OAJI — Open Agent Jobs Initiative",
  description:
    "OAJI is an industry coalition dedicated to making job data agent-accessible through open standards. Learn about the initiative behind OJCP.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <About />
      </main>
      <Footer />
    </>
  );
}
