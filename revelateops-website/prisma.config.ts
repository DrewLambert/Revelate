import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("POSTGRES_PRISMA_URL"),
  },
});
