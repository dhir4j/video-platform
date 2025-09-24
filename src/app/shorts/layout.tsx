
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BottomNavbar } from "@/components/layout/bottom-navbar";

export default function ShortsPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-screen overflow-hidden">
        {/* Sidebar is visible on desktop */}
        <div className="hidden md:block">
            <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header is visible on desktop */}
          <div className="hidden md:block">
            <Header />
          </div>
          {/* Main content takes full height and is black for the video player */}
          <main className="flex-1 bg-black">{children}</main>
          {/* Bottom Navbar is visible on mobile */}
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  );
}
