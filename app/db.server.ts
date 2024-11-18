import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

const sql = neon(process.env.DATABASE_URL);

export { sql };