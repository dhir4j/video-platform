"use client"

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { BottomNavbar } from "./bottom-navbar";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShortsPage = pathname.includes('/shorts/');

  if (isShortsPage) {
    return <main>{children}</main>;
  }
  
  return (
    <SidebarProvider>
      <div className="md:flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 lg:p-6 pb-20 md:pb-6">
            {children}
          </main>
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}
