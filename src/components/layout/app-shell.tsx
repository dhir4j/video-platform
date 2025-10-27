
"use client"

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { BottomNavbar } from "./bottom-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShortsRoute = pathname?.startsWith('/shorts');

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className={`flex-1 overflow-y-auto ${isShortsRoute ? '' : 'p-6 md:p-8 lg:p-10 pb-20 md:pb-8'}`}>
            {children}
          </main>
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}
