
import { BottomNavbar } from "@/components/layout/bottom-navbar";

export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="h-screen w-screen overflow-hidden bg-black">
        {children}
      </main>
      <BottomNavbar />
    </>
  );
}
