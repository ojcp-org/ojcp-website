import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "highlight.js/styles/monokai-sublime.min.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";
import { WebMCPProvider } from "@/components/WebMCPProvider";
import { CodeHighlightProvider } from "@/components/CodeHighlightProvider";
import { SITE_URL } from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, STRUCTURED_DATA } from "@/lib/seo";

// Site-wide defaults. Each page sets its own canonical URL, og:url and descriptions through
// pageMetadata (src/lib/seo.ts); a canonical here would be inherited by pages that set none.
export const metadata: Metadata = {
  // Absolute URLs for canonical links and social cards. Without it Next resolves them against
  // localhost at build time and warns, and an unfurler or crawler sees the wrong origin.
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Link previews. The card image comes from the file convention (src/app/opengraph-image.png and
  // twitter-image.png). Without it, unfurlers picked the first raster image on the page, which is
  // a steering-member logo.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // Icons are provided by the App Router file convention: src/app/favicon.ico
  // (legacy /favicon.ico) and src/app/icon.svg (crisp SVG for modern browsers).
};

export const viewport: Viewport = {
  themeColor: "#0c0c0f",
};

// JSON-LD is data, not markup: escape "<" so no string in it can close the script element.
const structuredData = JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
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
