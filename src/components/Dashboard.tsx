"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div>
          <h1>Welcome </h1>
          <p>You&apos;re logged in</p>
          {/* user info and logout */}

          <pre>{JSON.stringify(session, null, 2)}</pre>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signOut()}
          >
            SignOut
          </button>
        </div>
      ) : (
        <div>
          <h1>You&apos;re not logged in</h1>

          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           onClick={() => signIn()}>Sign in</button>

           

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => signIn("google")}
          >
            Sign in with google
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
