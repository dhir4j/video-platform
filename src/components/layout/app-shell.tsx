"use client"

import React from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <Header />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
