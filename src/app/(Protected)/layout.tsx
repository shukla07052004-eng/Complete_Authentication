

"use client";

import App from "@/components/layout/ProtectedAppShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">

      <App>
        {children}
      </App>

    </div>
  );
}
