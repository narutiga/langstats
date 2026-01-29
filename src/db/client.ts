import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { config } from '../config.js';
import * as schema from './schema.js';

const client = createClient({
  url: config.turso.url,
  authToken: config.turso.authToken,
});

export const db = drizzle(client, { schema });
