"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Video } from "@/lib/types"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"

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
      // Use replaceState to avoid cluttering browser history on scroll
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`)
    };
    
    api.on("select", handleSelect);

    if(startIndex > 0 && api.scrollSnapList().length > startIndex) {
        api.scrollTo(startIndex, true); // true for instant scroll
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
        className="relative w-full h-full"
        orientation="vertical"
        opts={{
            align: "start",
            loop: true,
            startIndex: startIndex,
        }}
    >
      <CarouselContent className="h-full -mt-0">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="pt-0 relative h-full">
              <div className="w-full h-full bg-black flex items-center justify-center">
                <Card className="w-[calc(100%-20px)] sm:w-auto sm:max-w-md aspect-[9/16] bg-slate-900 flex items-center justify-center rounded-2xl border-none text-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                         <h1 className="text-8xl font-bold">{index + 1}</h1>
                         <p className="mt-4 text-center">{video.title}</p>
                    </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1/2 -translate-x-1/2 top-4 hidden md:flex">
          <ChevronUp className="h-6 w-6"/>
          <span className="sr-only">Previous video</span>
      </CarouselPrevious>
       <CarouselNext className="absolute left-1/2 -translate-x-1/2 bottom-4 hidden md:flex">
          <ChevronDown className="h-6 w-6"/>
          <span className="sr-only">Next video</span>
      </CarouselNext>
    </Carousel>
  )
}
