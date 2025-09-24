"use client"

import * as React from "react"
import Image from "next/image"
import type { Video } from "@/lib/types"
import { useRouter } from "next/navigation"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"

interface ShortVideoCarouselProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortVideoCarousel({ videos, startIndex = 0 }: ShortVideoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const router = useRouter();

  React.useEffect(() => {
    if (!api) return;

    // Go to the initial index without triggering a URL change immediately
    if (startIndex > 0 && api.scrollSnapList().length > startIndex) {
      api.scrollTo(startIndex, true); // true for instant scroll
    }

    const handleSelect = (api: CarouselApi) => {
      if (videos.length === 0) return;
      const selectedVideoId = videos[api.selectedScrollSnap()].id;
      // Use replaceState to update URL without a full page navigation, preventing re-renders.
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`);
    };
    
    api.on("select", handleSelect);
    
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

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  return (
    <div className="w-full h-full flex items-center justify-center">
        <Carousel 
            setApi={setApi} 
            className="relative w-full h-full max-w-md"
            orientation="vertical"
            opts={{
                align: "start",
                loop: true,
                startIndex: startIndex,
            }}
        >
          <CarouselContent className="h-full -mt-0">
              {videos.map((video) => (
                <CarouselItem key={video.id} className="pt-0 relative h-full">
                   <Card className="w-full h-full bg-black flex items-center justify-center rounded-none border-none text-white overflow-hidden">
                        <CardContent className="relative w-full h-full flex flex-col items-center justify-center p-0">
                           <Image
                              src={video.thumbnailUrl}
                              alt={video.title}
                              fill
                              className="object-cover"
                              data-ai-hint="portrait model"
                              priority={true}
                            />
                           <div className="absolute bottom-4 left-4 text-white z-10 bg-black/50 p-2 rounded-md">
                              <h3 className="font-bold">{video.title}</h3>
                              <p className="text-sm text-gray-300">{video.uploaderId}</p>
                           </div>
                        </CardContent>
                    </Card>
                </CarouselItem>
              ))}
          </CarouselContent>

           {/* Buttons for Desktop */}
            <div className="hidden md:flex flex-col gap-2 absolute right-4 top-1/2 -translate-y-1/2 z-10">
                <Button onClick={scrollPrev} size="icon" variant="secondary">
                    <ChevronUp className="h-6 w-6"/>
                    <span className="sr-only">Previous video</span>
                </Button>
                <Button onClick={scrollNext} size="icon" variant="secondary">
                    <ChevronDown className="h-6 w-6"/>
                    <span className="sr-only">Next video</span>
                </Button>
            </div>
        </Carousel>
    </div>
  )
}
