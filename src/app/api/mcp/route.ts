import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createOjcpServer } from "@/lib/mcp-server";

// Stateless — each request gets a fresh server+transport (serverless-friendly)
async function handleMcp(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });

  const server = createOjcpServer();
  await server.connect(transport);

  const response = await transport.handleRequest(request);

  // Add CORS headers
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, mcp-session-id, mcp-protocol-version, Last-Event-ID"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(request: Request) {
  return handleMcp(request);
}

export async function POST(request: Request) {
  return handleMcp(request);
}

export async function DELETE(request: Request) {
  return handleMcp(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, mcp-session-id, mcp-protocol-version, Last-Event-ID",
    },
  });
}
