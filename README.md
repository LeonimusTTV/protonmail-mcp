# Proton MCP that's actually good

## Installation

```bash
bun install
```

## Build

```bash
bun run build
```

## Run

```bash
bun run start
```

## Claude desktop setip

```json
{
  "mcpServers": {
    "protonmail-mcp": {
      "command": "bun",
      "args": ["/path/to/protonmail-pro-mcp/dist/index.js"],
      "cwd": "/path/to/protonmail-pro-mcp"
    }
  }
}
```
