
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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clapperboard, Home, Flame, ListFilter, User, History, Clock, ThumbsUp, PlusSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUser, getUsers } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CategoryHoverMenu } from "./category-hover-menu";
import React from "react";


export function AppSidebar() {
  const pathname = usePathname();
  const user = getUser("user_1");
  const subscriptions = getUsers().slice(1, 6);
  const [categoryMenuOpen, setCategoryMenuOpen] = React.useState(false);

  const menuItems = [
    { href: "/", icon: <Home />, label: "Videos", tooltip: "Videos" },
    { href: "/shorts", icon: <Flame />, label: "Shorts", tooltip: "Shorts" },
  ];
  
  const libraryItems = [
      { href: "/profile#history", icon: <History />, label: "History", tooltip: "History" },
      { href: "/profile#watch-later", icon: <Clock />, label: "Watch Later", tooltip: "Watch Later" },
      { href: "/profile#liked", icon: <ThumbsUp />, label: "Liked Videos", tooltip: "Liked Videos" },
      { href: "/profile", icon: <User />, label: "Your Profile", tooltip: "Your Profile"},
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Clapperboard className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">VibeVerse</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton
                  tooltip={item.tooltip}
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
           <Popover open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
              <PopoverTrigger asChild>
                <div 
                  onMouseEnter={() => setCategoryMenuOpen(true)} 
                  onMouseLeave={() => setCategoryMenuOpen(false)}
                  className="w-full"
                >
                  <SidebarMenuItem>
                    <Link href="/categories" className="w-full">
                      <SidebarMenuButton
                        tooltip="Categories"
                        isActive={pathname.startsWith('/categories')}
                      >
                        <ListFilter />
                        <span>Categories</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </div>
              </PopoverTrigger>
              <PopoverContent 
                side="right" 
                align="start" 
                sideOffset={10} 
                className="p-0 w-48"
                onMouseEnter={() => setCategoryMenuOpen(true)} 
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                <CategoryHoverMenu />
              </PopoverContent>
            </Popover>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarMenu>
                 {libraryItems.map((item) => (
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
        </SidebarGroup>
        <SidebarSeparator />
         <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarMenu>
                {subscriptions.map(sub => (
                    <SidebarMenuItem key={sub.id}>
                        <Link href={`/profile/${sub.id}`} className="w-full">
                            <SidebarMenuButton tooltip={sub.name}>
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={sub.avatarUrl} alt={sub.name} />
                                    <AvatarFallback>{sub.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <span>{sub.name}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/profile" className="w-full">
                <SidebarMenuButton>
                <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate">{user?.name}</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton>
                <PlusSquare />
                <span>Create</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
