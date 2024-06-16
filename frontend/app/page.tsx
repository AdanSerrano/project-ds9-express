"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  //fetch user
  const { data: session } = useSession();
  // console.log({ session });
  return (
    <main className="relative flex justify-center items-center flex-col mx-auto w-full h-full min-h-screen sm:px-10 px-5">
      {session?.user ? (
        <>
          <p className="text-sky-600"> {session.user.name}</p>
          <button className="text-red-500" onClick={() => signOut()}>
            Sign Out
          </button>
        </>
      ) : (
        <button className="text-green-600" onClick={() => signIn()}>
          Sign In
        </button>
      )}
      <div className="grid grid-cols-3 gap-2">
      </div>
    </main>
  );
}
