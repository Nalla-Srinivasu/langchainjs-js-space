import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { evaluate } from "mathjs";

// Create MCP server
const mcpServer = new Server(
  {
    name: "stdio-calculator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "calculate",
      description: "Perform mathematical calculations using mathjs",
      inputSchema: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description:
              "Math expression to evaluate (e.g. '2 + 2', 'sqrt(16)', 'sin(pi/2)')",
          },
        },
        required: ["expression"],
      },
    },
    {
      name: "convert_temperature",
      description:
        "Convert temperature between Celsius and Fahrenheit",
      inputSchema: {
        type: "object",
        properties: {
          value: {
            type: "number",
            description: "Temperature value",
          },
          from: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
          },
          to: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
          },
        },
        required: ["value", "from", "to"],
      },
    },
  ],
}));

// Execute tools
mcpServer.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "calculate") {
      try {
        const result = evaluate(args.expression);

        return {
          content: [
            {
              type: "text",
              text: `${args.expression} = ${result}`,
            },
          ],
        };
      } catch (err) {
        throw new Error(
          `Invalid expression: ${err.message}`
        );
      }
    }

    if (name === "convert_temperature") {
      const { value, from, to } = args;

      if (from === to) {
        return {
          content: [
            {
              type: "text",
              text: `${value}°${from[0].toUpperCase()} = ${value}°${to[0].toUpperCase()}`,
            },
          ],
        };
      }

      let result;

      if (from === "celsius") {
        result = (value * 9) / 5 + 32;
      } else {
        result = ((value - 32) * 5) / 9;
      }

      return {
        content: [
          {
            type: "text",
            text: `${value}°${from[0].toUpperCase()} = ${result.toFixed(
              2
            )}°${to[0].toUpperCase()}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  }
);

// Start server
(async () => {
  const transport = new StdioServerTransport();

  await mcpServer.connect(transport);

  console.error("📟 stdio MCP Calculator Server running...");
  console.error(
    "🔧 Tools: calculate, convert_temperature"
  );
})();