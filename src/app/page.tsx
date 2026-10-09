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
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/", title: SITE_TITLE, description: SITE_DESCRIPTION });

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
