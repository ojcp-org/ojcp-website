import {
  Header,
  Hero,
  Features,
  Spec,
  HowItWorks,
  CodeExamples,
  ApplyPaths,
  Playground,
  Community,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Spec />
        <HowItWorks />
        <CodeExamples />
        <ApplyPaths />
        <Playground />
        <Community />
      </main>
      <Footer />
    </>
  );
}
