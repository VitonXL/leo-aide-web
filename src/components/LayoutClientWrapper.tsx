"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // MOCK USER ROLES - ПРИНУДИТЕЛЬНО ВКЛЮЧЕНЫ
  const userRoles = {
    isAdmin: true,
    isModerator: true,
    userId: "mod_001"
  };

  // --- ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ КЛАВИШ ---
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K или Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-global-search'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117]">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isAdmin={userRoles.isAdmin}
          isModerator={userRoles.isModerator}
          userId={userRoles.userId}
        />
        
        <main className="flex-1 w-full overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}