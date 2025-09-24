"use client"

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { BottomNavbar } from "./bottom-navbar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShortsPage = pathname.startsWith('/shorts');
  
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className={cn(
            "flex-1",
            isShortsPage ? "bg-black overflow-hidden" : "overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6"
          )}>
            {children}
          </main>
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}
