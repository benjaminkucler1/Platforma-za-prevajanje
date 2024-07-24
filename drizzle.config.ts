import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config();

const { DATABASE_URL } = process.env;

if(!DATABASE_URL) throw new Error("No database url provided!");

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: DATABASE_URL,
    }
})