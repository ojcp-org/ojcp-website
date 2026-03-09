// WebMCP API type definitions
// Based on Chrome WebMCP Early Preview (Mar 2026)
// https://developer.chrome.com/docs/ai/webmcp

interface ModelContextToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        enum?: string[];
        default?: unknown;
      }
    >;
    required?: string[];
  };
  annotations?: Record<string, string>;
  execute: (
    params: Record<string, unknown>
  ) => Promise<ModelContextToolResult> | ModelContextToolResult;
}

interface ModelContextToolResult {
  content: Array<
    | { type: "text"; text: string }
    | { type: "json"; data: unknown }
  >;
}

interface ModelContext {
  registerTool(tool: ModelContextToolDefinition): void;
  unregisterTool(name: string): void;
}

interface Navigator {
  modelContext?: ModelContext;
}
