"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, ListFilter, User, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shorts", icon: Flame, label: "Shorts" },
  { href: "/categories", icon: ListFilter, label: "Categories" },
  { href: "/subscribe", icon: Gem, label: "Premium" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive =
            (pathname === "/" && item.href === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-secondary group h-full"
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1 text-muted-foreground group-hover:text-primary",
                  isActive && "text-primary"
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
