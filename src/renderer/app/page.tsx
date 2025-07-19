'use client';

import Image from "next/image";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <Image
        className="invert dark:invert-0"
        src="/logo.svg"
        alt="Reqres logo"
        width={180}
        height={38}
        priority
      />
      <div className="text-8xl font-bold">reqres.</div>
      <a href="/projects" className="py-3 px-6 bg-black text-xl text-white mt-5 rounded-full flex items-center gap-2">
        <span><Plus className="size-6" /></span>
        <span>Create a new API</span>
      </a>
    </main>
  );
}
