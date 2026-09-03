"use client";
import { AppProvider } from "@/context/AppContext";
import { EscapeProvider } from "@/context/EscapeContext";
import { ToastProvider } from "@/context/ToastContext";

import EscapeEnabledAppShell from "@/components/layout/ProtectedAppShell";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <nav>
        My App
      </nav>

      <div className="flex">

        {/* Sidebar */}
        <aside>
          sidebar
        </aside>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}
