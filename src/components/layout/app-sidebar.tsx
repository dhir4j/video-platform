"use client"

import Link from "next/link";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, User, Settings, Clapperboard, ListFilter } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/data";


export function AppSidebar() {
  const pathname = usePathname();
  const user = getUser("user_1");

  const menuItems = [
    { href: "/", icon: <Clapperboard />, label: "Video", tooltip: "Video" },
    { href: "/shorts", icon: <Flame />, label: "Shorts", tooltip: "Shorts" },
    { href: "/categories", icon: <ListFilter />, label: "Categories", tooltip: "Categories" },
    { href: "/profile", icon: <User />, label: "Profile", tooltip: "Profile" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Clapperboard className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">NexusEros</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton
                  tooltip={item.tooltip}
                  isActive={pathname === item.href}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={user?.name}>
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="truncate">{user?.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
