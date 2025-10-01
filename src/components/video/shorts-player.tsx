"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Video } from "@/lib/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUser } from "@/lib/data";

interface ShortsPlayerProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortsPlayer({ videos, startIndex = 0 }: ShortsPlayerProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const router = useRouter();

  React.useEffect(() => {
    if (!api) return;

    if (api.selectedScrollSnap() !== startIndex) {
      api.scrollTo(startIndex, true);
    }
    
    const handleSelect = (api: CarouselApi) => {
      if (videos.length === 0) return;
      const selectedVideoId = videos[api.selectedScrollSnap()].id;
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`);
    };
    
    api.on("select", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
    }
  }, [api, startIndex, videos, router]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        api?.scrollPrev();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        api?.scrollNext();
      }
    },
    [api]
  );

  return (
    <div 
        className="w-full h-full focus:outline-none"
        onKeyDownCapture={handleKeyDown}
        tabIndex={0}
        ref={(el) => el?.focus()}
    >
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
              {videos.map((video) => {
                const uploader = getUser(video.uploaderId);
                return (
                  <CarouselItem key={video.id} className="pt-0 relative h-full">
                     <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <div className="relative w-full h-full max-w-[26rem] mx-auto">
                            <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-contain"
                                data-ai-hint="portrait model"
                                priority={true}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Video Info Overlay */}
                            <div className="absolute bottom-4 left-4 text-white z-10 p-2 rounded-md max-w-[calc(100%-80px)]">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-8 w-8 border-2 border-white">
                                    <AvatarImage src={uploader?.avatarUrl} />
                                    <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-sm truncate">{uploader?.name}</p>
                                </div>
                                <h3 className="font-bold text-base truncate">{video.title}</h3>
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2">{video.description}</p>
                            </div>

                            {/* Action Buttons Overlay */}
                            <div className="absolute bottom-4 right-4 text-white z-10 flex flex-col items-center gap-4">
                                <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10">
                                    <Heart className="h-6 w-6"/>
                                    <span className="text-xs font-bold">{video.likes > 1000 ? `${(video.likes/1000).toFixed(1)}k` : video.likes}</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10">
                                    <MessageCircle className="h-6 w-6"/>
                                    <span className="text-xs font-bold">{video.commentsCount}</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10">
                                    <Share2 className="h-6 w-6"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10">
                                    <MoreVertical className="h-6 w-6"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                  </CarouselItem>
                )
              })}
          </CarouselContent>
        </Carousel>
    </div>
  )
}
