"use client"

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isShortsPage = pathname.startsWith('/shorts');

    if (isShortsPage) {
        return <>{children}</>;
    }

    return (
        <AppShell>
            {children}
        </AppShell>
    );
}
