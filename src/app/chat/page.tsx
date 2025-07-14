// src/app/chat/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [msgs, setMsgs] = useState<{ user: "you" | "bot"; text: string }[]>([]);
  const [inp, setInp] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever msgs change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (status === "loading") {
    return <p className="p-4 text-center">Checking session…</p>;
  }
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">Please sign in to use the chat.</p>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const send = async () => {
    setMsgs((m) => [...m, { user: "you", text: inp }]);
    setInp("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inp }),
      });
      const { reply } = await res.json();
      setMsgs((m) => [...m, { user: "bot", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { user: "bot", text: "⚠️ Error contacting API." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shadow">
        <h1 className="text-xl font-semibold">ChatPilot</h1>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Sign out
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-auto px-4 py-2 space-y-2 bg-gray-100">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`max-w-xl mx-auto p-3 rounded-lg ${
                m.user === "you"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-white text-gray-800 self-start"
              }`}
            >
              <span className="block font-medium mb-1 capitalize">{m.user}</span>
              <p>{m.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </main>

      {/* Input */}
      <footer className="flex items-center px-4 py-2 bg-white shadow">
        <input
          type="text"
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && inp && send()}
          placeholder="Type a message…"
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={send}
          disabled={!inp}
          className="px-4 py-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
