"use client"

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { BottomNavbar } from "./bottom-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The new shorts layout handles its own structure, so the main AppShell should not render for those paths.
  const isShortsPage = pathname.startsWith('/shorts');

  if (isShortsPage) {
    // Return children directly, the shorts layout will wrap them.
    return <>{children}</>;
  }

  // Default layout for all other pages
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6">
            {children}
          </main>
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}
