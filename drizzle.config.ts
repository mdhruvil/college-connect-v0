import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken:
      env.NODE_ENV === "production" ? env.DATABASE_AUTH_TOKEN : undefined,
  },
  tablesFilter: ["college-connect_*"],
} satisfies Config;
