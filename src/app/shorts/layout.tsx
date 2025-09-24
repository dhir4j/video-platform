"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header is part of the layout on desktop, but not for reels */}
          <div className="hidden md:block">
            <Header />
          </div>
          {/* Main content takes full height */}
          <main className="flex-1 bg-black">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
