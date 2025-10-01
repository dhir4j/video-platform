
"use client"

import Link from "next/link";
import type { Video } from "@/lib/types";
import { Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VideoCard } from "./video-card";

interface PremiumSectionProps {
  videos: Video[];
}

export function PremiumSection({ videos }: PremiumSectionProps) {
  return (
    <Card className="bg-secondary/50 border-primary/20 shadow-lg shadow-primary/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gem className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold">NexusEros Premium</h2>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Unlock exclusive ad-free content from your favorite creators. Get early access to new videos and support the community.
            </p>
          </div>
          <Link href="/subscribe">
            <Button size="lg">Upgrade Now</Button>
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 'auto',
          }}
          className="w-full"
        >
          <CarouselContent>
            {videos.map((video) => (
              <CarouselItem key={video.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1">
                  <VideoCard video={video} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
