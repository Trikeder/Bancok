import { Pool } from 'pg';

export const pool = new Pool({
  user: 'bancok_user',
  host: 'postgres',
  database: 'bancok',
  password: process.env.DB_PASSWORD,
  port: 5432,
});