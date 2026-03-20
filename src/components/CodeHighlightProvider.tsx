"use client";

import { CodeHighlightAdapterProvider, createHighlightJsAdapter } from "@mantine/code-highlight";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

const adapter = createHighlightJsAdapter(hljs);

export function CodeHighlightProvider({ children }: { children: React.ReactNode }) {
  return (
    <CodeHighlightAdapterProvider adapter={adapter}>
      {children}
    </CodeHighlightAdapterProvider>
  );
}
