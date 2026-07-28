import {
  Header,
  Hero,
  FoundingMembers,
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
        <FoundingMembers />
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
