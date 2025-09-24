"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Video } from "@/lib/types"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ShortVideoCarouselProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortVideoCarousel({ videos, startIndex = 0 }: ShortVideoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const router = useRouter();

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = (api: CarouselApi) => {
      if (videos.length === 0) return;
      const selectedVideoId = videos[api.selectedScrollSnap()].id;
      // Update URL without navigating
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`)
    };
    
    api.on("select", handleSelect);

    // Set initial scroll snap
    if(startIndex > 0 && api.scrollSnapList().length > startIndex) {
        api.scrollTo(startIndex, true);
    }
    
    // Set initial URL
    if (videos.length > 0) {
      const initialVideoId = videos[api.selectedScrollSnap()].id;
      if(initialVideoId) {
          window.history.replaceState(null, '', `/shorts/${initialVideoId}`)
      }
    }
    
    return () => {
      api.off("select", handleSelect);
    }

  }, [api, startIndex, videos, router]);

  if (videos.length === 0) {
    return (
        <div className="h-full bg-black flex items-center justify-center text-white">
            <p>No shorts available.</p>
        </div>
    )
  }

  return (
    <Carousel 
        setApi={setApi} 
        className="w-full h-full" 
        orientation="vertical"
        opts={{
            align: "start",
            loop: true,
            startIndex: startIndex,
        }}
    >
      <CarouselContent className="-mt-0 h-full">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="pt-0 h-full">
               <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-none border-none text-white">
                <div className="text-center">
                  <h1 className="text-6xl font-bold">{index + 1}</h1>
                  <p className="mt-4">{video.title}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  )
}
