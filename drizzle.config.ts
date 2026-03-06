import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './database/schema.ts',
  out: './drizzle',
  schemaFilter: [process.env.DB_SCHEMA ?? 'public'],
  migrations: {
    schema: process.env.DB_MIGRATIONS_SCHEMA ?? 'drizzle',
    table: process.env.DB_MIGRATIONS_TABLE ?? '__drizzle_migrations'
  },
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME ?? 'postgres',
    ssl: process.env.DB_SSL === 'true'
  }
});
