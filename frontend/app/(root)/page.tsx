"use client";

import { Grid } from "@/components/Grid";
import { Hero } from "@/components/Hero";
import { User } from "@/interface";
import { currentUser } from "@/lib/verificationToken";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(currentUser());
  }, []);

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Hero />
        <Grid />
      </div>
    </main>
  );
}