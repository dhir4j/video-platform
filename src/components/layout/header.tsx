
"use client"

import Link from "next/link";
import { Search, User as UserIcon, MessageSquare, Rss, PlusSquare, Clapperboard } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUser } from "@/lib/data";
import { ThemeToggle } from "./theme-toggle";


export function Header() {
  const user = getUser("user_1");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur-md lg:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden hover:bg-accent transition-colors" />
        <Link href="/" className="flex items-center gap-2 md:hidden group">
            <Clapperboard className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-foreground">VibeVerse</span>
        </Link>
      </div>

      <div className="relative flex-1 max-w-md hidden md:block mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
        <Input
          type="search"
          placeholder="Search videos, creators..."
          className="w-full rounded-full bg-secondary/50 pl-10 border-transparent focus-visible:ring-primary/20 hover:bg-secondary/80 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
              <Avatar className="h-9 w-9 ring-2 ring-border hover:ring-primary/50 transition-all">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  @{user?.id}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile"><DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem></Link>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
