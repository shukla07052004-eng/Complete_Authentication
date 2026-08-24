'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <SessionProvider>
        {children}
        </SessionProvider>
      </div>
    </main>
  );
}