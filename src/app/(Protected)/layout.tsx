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
          Sidebar
        </aside>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}