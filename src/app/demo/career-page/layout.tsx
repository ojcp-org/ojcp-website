import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senior Software Engineer, Platform | Globex Corporation Careers",
  description:
    "Apply for Senior Software Engineer, Platform at Globex Corporation. Chicago, IL. $140,000 - $185,000.",
  robots: "noindex, nofollow",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
