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
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`)
    };
    
    api.on("select", handleSelect);

    if(startIndex > 0 && api.scrollSnapList().length > startIndex) {
        api.scrollTo(startIndex, true);
    }
    
    if (videos.length > 0) {
      const initialVideoId = videos[api.selectedScrollSnap()].id;
      if(initialVideoId) {
          window.history.replaceState(null, '', `/shorts/${initialVideoId}`)
      }
    }
    
    return () => {
      api.off("select", handleSelect);
    }

  }, [api, startIndex, videos]);

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
            <CarouselItem key={video.id} className="pt-0 relative h-full">
              <div className="w-full h-full bg-black flex items-center justify-center">
                {/* Dummy Content */}
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <h1 className="text-white text-2xl">Video {index + 1}</h1>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  )
}
