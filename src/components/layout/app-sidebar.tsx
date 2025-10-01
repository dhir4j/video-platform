
"use client"

import Link from "next/link";
import React from "react";
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
import { Clapperboard, Home, Flame, ListFilter, User, History, Clock, ThumbsUp, PlusSquare, TrendingUp, Star, Heart, Gem } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUser, getUsers, getTags } from "@/lib/data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const user = getUser("user_1");
  const subscriptions = getUsers().slice(1, 6);
  const tags = getTags();
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
  
  const exploreItems = [
    { href: "/trending", icon: <TrendingUp />, label: "Trending", tooltip: "Trending" },
    { href: "/popular", icon: <Star />, label: "Popular", tooltip: "Popular" },
    { href: "/most-liked", icon: <Heart />, label: "Most Liked", tooltip: "Most Liked" },
  ];


  return (
    <Sidebar>
      <SidebarHeader className="mb-2">
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
           <Collapsible open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen} className="w-full">
              <div 
                onMouseEnter={() => setCategoryMenuOpen(true)} 
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                <CollapsibleTrigger asChild>
                    <SidebarMenuItem className="w-full">
                         <SidebarMenuButton
                            tooltip="Categories"
                            isActive={pathname.startsWith('/categories')}
                            className="w-full justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <ListFilter />
                              <span>Categories</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", categoryMenuOpen && "rotate-180")} />
                          </SidebarMenuButton>
                    </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                   <div className="flex flex-col space-y-1 py-2 pl-11 pr-2">
                    {tags.slice(0, 5).map((tag) => (
                      <Link
                        href={`/categories/${tag.toLowerCase()}`}
                        key={tag}
                        className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {tag}
                      </Link>
                    ))}
                     <Link
                        href="/categories"
                        className="rounded-md px-2 py-1.5 text-sm font-semibold text-primary hover:bg-accent hover:text-accent-foreground"
                      >
                        View All...
                      </Link>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
        </SidebarMenu>
        <SidebarSeparator />
         <SidebarGroup>
            <SidebarGroupLabel>Explore</SidebarGroupLabel>
            <SidebarMenu>
                 {exploreItems.map((item) => (
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
         <Link href="/subscribe" className="px-2">
            <Button className="w-full justify-start" variant="outline">
                <Gem className="mr-2 h-4 w-4" />
                Premium
            </Button>
         </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
