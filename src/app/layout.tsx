import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "highlight.js/styles/monokai-sublime.min.css";
import "./globals.css";

import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { WebMCPProvider } from "@/components/WebMCPProvider";
import { CodeHighlightProvider } from "@/components/CodeHighlightProvider";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  // Absolute URLs for canonical links and social cards. Without it Next resolves them against
  // localhost at build time and warns, and an unfurler or crawler sees the wrong origin.
  metadataBase: new URL(SITE_URL),
  title: "OJCP — Open Job Context Protocol",
  description:
    "The open standard for agent-consumable job feeds. Discover, reason over, and act on job opportunities with AI agents.",
  // Icons are provided by the App Router file convention: src/app/favicon.ico
  // (legacy /favicon.ico) and src/app/icon.svg (crisp SVG for modern browsers).
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
