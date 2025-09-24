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
      <div className={cn("relative md:flex", isShortsPage && "md:h-screen md:overflow-hidden")}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className={cn("flex-1 p-4 lg:p-6 pb-20 md:pb-6 overflow-x-hidden", isShortsPage && "p-0 lg:p-0 md:pb-0")}>
            {children}
          </main>
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}
