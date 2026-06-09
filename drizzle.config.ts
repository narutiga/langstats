import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: requireEnv('TURSO_DATABASE_URL'),
    authToken: requireEnv('TURSO_AUTH_TOKEN'),
  },
});
