import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dbConnection } from "./client";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const db = dbConnection();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [tanstackStartCookies()],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
