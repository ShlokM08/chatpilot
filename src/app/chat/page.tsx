// src/app/chat/page.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [msgs, setMsgs] = useState<{ user: string; text: string }[]>([]);
  const [inp, setInp] = useState("");

  if (status === "loading") {
    return <p className="p-4">Loading…</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">You need to sign in to chat.</p>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  const send = async () => {
    const userMessage = inp;
    setMsgs((m) => [...m, { user: "you", text: userMessage }]);
    setInp("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const { reply } = await res.json();
      setMsgs((m) => [...m, { user: "bot", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { user: "bot", text: "Error contacting API." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-auto space-y-2 mb-4">
        {msgs.map((m, i) => (
          <p key={i}>
            <strong>{m.user}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded px-2"
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inp) send();
          }}
        />
        <button
          onClick={send}
          disabled={!inp}
          className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
