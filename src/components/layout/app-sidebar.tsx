"use client"

import Link from "next/link";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Tag, Settings, LogOut, Clapperboard } from "lucide-react";
import { getCountries, getTags } from "@/lib/data";

export function AppSidebar() {
  const countries = getCountries();
  const tags = getTags();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <Clapperboard className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">NexusEros</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Countries">
                <Globe />
                <span>Countries</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenu className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden">
              {countries.map(country => (
                <SidebarMenuItem key={country}>
                  <Link href={`/country/${country.toLowerCase()}`} className="w-full">
                    <SidebarMenuButton size="sm" className="w-full justify-start">
                      {country}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Tags">
                <Tag />
                <span>Tags</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenu className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden">
              {tags.map(tag => (
                <SidebarMenuItem key={tag}>
                  <Link href={`/tag/${tag.toLowerCase()}`} className="w-full">
                    <SidebarMenuButton size="sm" className="w-full justify-start">
                      #{tag}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarMenu>
        </SidebarGroup>
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
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
