import { AppProvider } from "@/context/AppContext";
import { ToastProvider } from "@/context/ToastContext";
import { EscapeProvider } from "@/context/EscapeContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppProvider>
        <EscapeProvider>
          <ProtectedAppShell>
            {children}
          </ProtectedAppShell>
        </EscapeProvider>
      </AppProvider>
    </ToastProvider>
  );
}