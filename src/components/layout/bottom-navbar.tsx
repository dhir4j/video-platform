"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Clapperboard, User, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterSheet } from "../video/filter-sheet";
import { Button } from "../ui/button";

const navItems = [
  { href: "/shorts", icon: Flame, label: "Shorts" },
  { href: "/", icon: Clapperboard, label: "Video" },
  { href: "#", icon: ListFilter, label: "Categories", isTrigger: true },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNavbar() {
  const pathname = usePathname();
  const { setOpen } = useFilterSheet();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          if (item.isTrigger) {
            return (
              <Button
                key={item.label}
                variant="ghost"
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-secondary group h-full rounded-none"
                onClick={() => setOpen(true)}
              >
                <item.icon
                  className="w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary"
                />
                <span className="sr-only">{item.label}</span>
              </Button>
            );
          }

          const isActive = (pathname === item.href) || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href));
          const isHomeActive = item.href === "/" && pathname === "/";
          const finalIsActive = item.href === "/" ? isHomeActive : isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-secondary group"
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary",
                  finalIsActive && "text-primary"
                )}
              />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
