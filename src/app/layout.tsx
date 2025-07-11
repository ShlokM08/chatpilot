// src/app/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Chat Rocket</title>
      </head>
      <body>
        {/* Wrap your entire app in SessionProvider */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
