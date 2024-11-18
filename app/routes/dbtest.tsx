import { sql } from '../db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};

export default function Page() {
  const data = useLoaderData();
  return <>{data}</>;
}