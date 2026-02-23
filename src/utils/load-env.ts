import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Load environment variables from .env file without any stdout output
 * This is critical for MCP servers where stdout is reserved for JSON-RPC
 */
export function loadEnv(): void {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = join(__dirname, "..", "..", ".env");

    const envFile = readFileSync(envPath, "utf-8");

    // Parse .env file line by line
    envFile.split("\n").forEach((line) => {
      // Skip empty lines and comments
      line = line.trim();
      if (!line || line.startsWith("#")) {
        return;
      }

      // Parse KEY=VALUE
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // Only set if not already defined (environment variables take precedence)
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    // Silently fail if .env doesn't exist - env vars might come from elsewhere
    // Don't write to stdout/stderr here as it might interfere with MCP protocol
  }
}
