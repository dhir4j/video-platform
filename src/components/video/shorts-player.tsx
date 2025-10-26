
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Video } from "@/lib/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUser } from "@/lib/data";

interface ShortsPlayerProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortsPlayer({ videos, startIndex = 0 }: ShortsPlayerProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const videoRefs = React.useRef<Map<string, HTMLVideoElement>>(new Map());
  const router = useRouter();

  React.useEffect(() => {
    if (!api) return;

    if (api.selectedScrollSnap() !== startIndex) {
      api.scrollTo(startIndex, true);
    }

    const handleSelect = (api: CarouselApi) => {
      if (videos.length === 0) return;
      const selectedIndex = api.selectedScrollSnap();
      setCurrentIndex(selectedIndex);
      const selectedVideoId = videos[selectedIndex].id;
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`);

      // Play current video and pause others
      videoRefs.current.forEach((video, id) => {
        if (id === selectedVideoId) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    }
  }, [api, startIndex, videos, router]);

  React.useEffect(() => {
    // Auto-play first video on mount
    if (videos.length > 0) {
      const firstVideo = videoRefs.current.get(videos[currentIndex].id);
      if (firstVideo) {
        firstVideo.play().catch(() => {});
      }
    }
  }, [videos, currentIndex]);

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      video.muted = !isMuted;
    });
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
        className="w-full h-full focus:outline-none"
        onKeyDownCapture={handleKeyDown}
        tabIndex={0}
        ref={(el) => el?.focus()}
    >
        <Carousel
            setApi={setApi}
            className="relative w-full h-full overflow-hidden"
            orientation="vertical"
            opts={{
                align: "start",
                loop: true,
                startIndex: startIndex,
                skipSnaps: false,
                dragFree: false,
            }}
        >
          <CarouselContent className="h-screen -mt-0">
              {videos.map((video, index) => {
                const uploader = getUser(video.uploaderId);
                return (
                  <CarouselItem key={video.id} className="pt-0 relative h-screen min-h-screen basis-full">
                     <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <div className="relative w-full h-full max-w-[26rem] mx-auto">
                            {/* Video Element - Using placeholder for now */}
                            <video
                                ref={(el) => {
                                  if (el) {
                                    videoRefs.current.set(video.id, el);
                                  }
                                }}
                                src={video.videoUrl || `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
                                poster={video.thumbnailUrl}
                                className="w-full h-full object-contain"
                                loop
                                muted={isMuted}
                                playsInline
                                preload="metadata"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

                            {/* Mute/Unmute Button */}
                            <Button
                                onClick={toggleMute}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white hover:bg-white/20 z-20"
                            >
                                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </Button>

                            {/* Video Info Overlay */}
                            <div className="absolute bottom-20 left-4 text-white z-10 p-2 rounded-md max-w-[calc(100%-100px)]">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-10 w-10 border-2 border-white">
                                    <AvatarImage src={uploader?.avatarUrl} />
                                    <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-sm">{uploader?.name}</p>
                                </div>
                                <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
                                <p className="text-xs text-gray-200 mt-1 line-clamp-2">{video.description}</p>
                            </div>

                            {/* Action Buttons Overlay */}
                            <div className="absolute bottom-20 right-4 text-white z-10 flex flex-col items-center gap-5">
                                <Button variant="ghost" size="icon" className="h-14 w-14 flex-col gap-0.5 text-white hover:bg-white/10 rounded-full">
                                    <Heart className="h-7 w-7"/>
                                    <span className="text-xs font-semibold">{formatCount(video.likes)}</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-14 w-14 flex-col gap-0.5 text-white hover:bg-white/10 rounded-full">
                                    <MessageCircle className="h-7 w-7"/>
                                    <span className="text-xs font-semibold">{formatCount(video.commentsCount)}</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-14 w-14 text-white hover:bg-white/10 rounded-full">
                                    <Share2 className="h-7 w-7"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-14 w-14 text-white hover:bg-white/10 rounded-full">
                                    <MoreVertical className="h-7 w-7"/>
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
