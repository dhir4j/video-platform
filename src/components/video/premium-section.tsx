
"use client"

import Link from "next/link";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PremiumSection() {
  return (
    <div className="rounded-lg bg-secondary/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20">
      <div className="flex items-center gap-4">
        <Gem className="w-8 h-8 text-primary hidden sm:block" />
        <div>
          <h2 className="text-xl md:text-2xl font-bold">VibeVerse Premium</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Unlock exclusive content, ad-free viewing, and more.
          </p>
        </div>
      </div>
      <Link href="/subscribe">
        <Button size="lg" className="w-full md:w-auto">Upgrade Now</Button>
      </Link>
    </div>
  );
}
