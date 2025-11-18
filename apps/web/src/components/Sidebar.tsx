"use client";

import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps): JSX.Element {
  const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Patients", href: "/patients", icon: "👥" },
    { name: "Appointments", href: "/appointments", icon: "📅" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div className="h-full overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
              >
                <span className="mr-3 text-xl">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={onToggle} />}

      {/* Toggle button for mobile */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 md:hidden z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </>
  );
}
