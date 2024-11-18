import type { Todo } from '../schema';
import { neon } from '@neondatabase/serverless';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";



export const loader: LoaderFunction = async (args) =>{
  const { userId, getToken } = await getAuth(args);
  const authToken = await getToken();
  console.log(userId);
  if (!authToken) {
    return null;
  }  
  const DATABASE_AUTHENTICATED_URL=
  process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL;
  try {
        const sql = neon(DATABASE_AUTHENTICATED_URL ?? '', {
                authToken,
            });

    // const result = await getDb(authToken,DATABASE_AUTHENTICATED_URL)(
    //   `INSERT INTO login_history ("user_id") VALUES ($1) RETURNING *`,[userId]);
    const todosResponse = await sql(`INSERT INTO login_history ("user_id") VALUES ($1) RETURNING *`,[userId]);
    
      // Retrieve last 10 logins
  const last10LoginsResponse = await sql(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_at DESC LIMIT 10`, [userId]);

    console.log(`Todos Response: ${JSON.stringify(todosResponse)}`);
    return last10LoginsResponse as Array<Todo>;
        }
        catch (error) {
            console.error(`Error inserting into login_history table: ${error.message}`);
            console.error(`Error details: ${JSON.stringify(error)}`);
            throw error;
          }
};

export default function TodoList() {
  const todos = useLoaderData();

  return (
    <div>
    <h1 style={{ padding: '20px 0', marginBottom: '10px' }}>
      Your Last 10 Logins
    </h1>

    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>
          {todo.user_id} login at: {todo.login_at}
        </li>
      ))}
    </ul>
    </div>
  );
}