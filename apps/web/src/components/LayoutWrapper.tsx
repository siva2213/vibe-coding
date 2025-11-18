"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="md:ml-64 transition-all duration-300 pt-16">{children}</main>
    </div>
  );
}
