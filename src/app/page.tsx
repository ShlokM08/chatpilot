// src/app/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  // While checking session status
  if (status === "loading") {
    return <p className="p-4">Loading…</p>;
  }

  // If the user is signed in, show a welcome message + sign-out
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-xl">
          Welcome, <strong>{session.user?.name}</strong>!
        </p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Sign out
        </button>
        {/* Link to your chat page */}
        <a
          href="/chat"
          className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Go to Chat
        </a>
      </div>
    );
  }

  // If not signed in, show a sign-in button
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Chat Rocket</h1>
      <p>Sign in to start chatting with your AI bot.</p>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
