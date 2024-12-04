import { SignOutButton, UserButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";
import { addLoginHistory,getRecentLogins } from '../loginHistory.client'
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { useState } from 'react';
import { neon } from '@neondatabase/serverless';
import type { LoginHistory } from '../schema';



export const loader: LoaderFunction = async (args) => {
  const { userId, getToken } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
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


    const loginResponse = await sql(`INSERT INTO login_history ("user_id") VALUES ($1) RETURNING *`,[userId]);
    
      // Retrieve last 10 logins
  const last10LoginsResponse = await sql(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_at DESC LIMIT 10`, [userId]);

    console.log(`loginResponse: ${JSON.stringify(loginResponse)}`);
    return last10LoginsResponse as Array<LoginHistory>;
        }
        catch (error) {
            console.error(`Error inserting into login_history table: ${error.message}`);
            console.error(`Error details: ${JSON.stringify(error)}`);
            throw error;
          }
}


export default function Index() {
  const logins = useLoaderData();

  return (
    <>
    
    <div>
        <h1>Signed in</h1>
        <p>You are signed in!</p>
        <p> <UserButton /></p>

        <div>
          <h1>Recent Logins</h1>
              {logins?.map((logins) => (
            <li key={logins.id}>
              {logins.user_id} login at: {logins.login_at}
            </li>
              ))}
         
        </div>
        <p>< SignOutButton > Sign Out</ SignOutButton ></p>
    </div>
    </>
  );
}