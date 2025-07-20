'use client'
import Head from "next/head";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
const handleTryRecorder = () => {
  setIsLoading(true);
  setTimeout(() => {
    router.push('/facetrack'); 
  }, 1500); 
};

  return (
   <>
    <Head >
        <title>Face-Tracking-Application</title>
    </Head>

    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold mb-4">🎯Face Tracker Video Recorder</h1>
        <p className="mb-6">This application uses face tracking to record videos.</p>
       {isLoading ? (
  <div className="flex items-center gap-2 text-blue-500 font-semibold">
    <svg
      className="animate-spin h-10 w-10 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
    <span>Launching Tracker...</span>
  </div>
) : (
  <button
  onClick={handleTryRecorder}
  disabled={isLoading}
  className="inline-flex items-center justify-center cursor-pointer px-6 py-3 rounded-lg bg-green-500 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors duration-300 ease-in-out hover:shadow-lg"
>
  🎬 Try Face Recorder
</button>

)}

    </main>
    </>
  );
}
