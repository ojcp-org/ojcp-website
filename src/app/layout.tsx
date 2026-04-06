import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "highlight.js/styles/monokai-sublime.min.css";
import "./globals.css";

import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { WebMCPProvider } from "@/components/WebMCPProvider";
import { CodeHighlightProvider } from "@/components/CodeHighlightProvider";

export const metadata: Metadata = {
  title: "OJCP — Open Job Context Protocol",
  description:
    "The open standard for agent-consumable job feeds. Discover, reason over, and act on job opportunities with AI agents.",
  icons: {
    icon: "/logos/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <CodeHighlightProvider>
            <WebMCPProvider />
            {children}
          </CodeHighlightProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
