"use client";

import { SpotlightFound } from "@/components/SpotlightFound";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  //fetch user
  return (
    <SpotlightFound>
      <main className="relative flex justify-center items-center flex-col mx-auto w-full h-full min-h-screen sm:px-10 px-5">

        <div className="grid grid-cols-3 gap-2">
        </div>
      </main>
    </SpotlightFound>
  );
}
