
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
import { Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUser } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentThread } from "../comments/comment-thread";

interface ShortsPlayerProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortsPlayer({ videos, startIndex = 0 }: ShortsPlayerProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const [showDescription, setShowDescription] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const videoRefs = React.useRef<Map<string, HTMLVideoElement>>(new Map());
  const router = useRouter();
  const isScrolling = React.useRef(false);

  React.useEffect(() => {
    if (!api) return;

    if (api.selectedScrollSnap() !== startIndex) {
      api.scrollTo(startIndex, true);
    }

    const handleSelect = (api: CarouselApi) => {
      if (videos.length === 0) return;
      const selectedIndex = api.selectedScrollSnap();
      setCurrentIndex(selectedIndex);
      setShowDescription(false);
      setShowComments(false);
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

  // Mouse wheel navigation
  const handleWheel = React.useCallback((event: WheelEvent) => {
    if (!api || isScrolling.current || showComments || showDescription) return;

    event.preventDefault();
    event.stopPropagation();

    if (Math.abs(event.deltaY) > 20) {
      isScrolling.current = true;

      if (event.deltaY > 0) {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 600);
    }
  }, [api, showComments, showDescription]);

  React.useEffect(() => {
    const container = document.getElementById('shorts-container');
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => handleWheel(e);
    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [handleWheel]);

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

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  const currentVideo = videos[currentIndex];
  const currentUploader = getUser(currentVideo?.uploaderId);

  return (
    <div
        id="shorts-container"
        className="w-full h-full focus:outline-none relative"
        onKeyDownCapture={handleKeyDown}
        tabIndex={0}
        ref={(el) => el?.focus()}
    >
        <Carousel
            setApi={setApi}
            className="relative w-full h-full overflow-hidden"
            orientation="vertical"
            opts={{
                align: "center",
                loop: true,
                startIndex: startIndex,
                skipSnaps: false,
                dragFree: false,
            }}
        >
          <CarouselContent className="h-full -mt-0">
              {videos.map((video, index) => {
                const uploader = getUser(video.uploaderId);
                const isActive = index === currentIndex;
                return (
                  <CarouselItem key={video.id} className="pt-0 relative h-full min-h-full basis-full">
                     <div className="relative w-full h-full flex items-center justify-center bg-background">
                        <div className="relative w-full h-full max-w-[450px] mx-auto">
                            {/* Video Element */}
                            <video
                                ref={(el) => {
                                  if (el) {
                                    videoRefs.current.set(video.id, el);
                                  }
                                }}
                                src={video.videoUrl || `https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg`}
                                poster={video.thumbnailUrl || `https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg`}
                                className="w-full h-full object-cover cursor-pointer"
                                loop
                                muted={isMuted}
                                playsInline
                                preload="metadata"
                                onClick={handleVideoClick}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                            {/* Mute/Unmute Button */}
                            <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMute();
                                }}
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white hover:bg-white/20 z-20"
                            >
                                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </Button>

                            {/* Video Info Overlay */}
                            <div className="absolute bottom-4 left-4 right-20 text-white z-10">
                                <div className="flex items-center gap-3 mb-3">
                                  <Avatar className="h-10 w-10 border-2 border-white">
                                    <AvatarImage src={uploader?.avatarUrl} />
                                    <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-base">{uploader?.name}</p>
                                </div>
                                <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                                <p className={`text-sm text-gray-200 ${showDescription && isActive ? '' : 'line-clamp-2'}`}>
                                  {video.description}
                                </p>
                                {!showDescription && isActive && (
                                  <button
                                    onClick={handleVideoClick}
                                    className="text-sm text-gray-400 hover:text-white mt-1"
                                  >
                                    ...more
                                  </button>
                                )}
                            </div>

                            {/* Action Buttons Overlay */}
                            <div className="absolute bottom-4 right-4 text-white z-10 flex flex-col items-center gap-6">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-14 w-14 flex-col gap-1 text-white hover:bg-white/20 rounded-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                    <Heart className="h-7 w-7"/>
                                    <span className="text-xs font-semibold">{formatCount(video.likes)}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-14 w-14 flex-col gap-1 text-white hover:bg-white/20 rounded-full"
                                  onClick={handleCommentsClick}
                                >
                                    <MessageCircle className="h-7 w-7"/>
                                    <span className="text-xs font-semibold">{formatCount(video.commentsCount)}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-14 w-14 text-white hover:bg-white/20 rounded-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                    <Share2 className="h-7 w-7"/>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-14 w-14 text-white hover:bg-white/20 rounded-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
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

        {/* Comments Overlay - Instagram Style */}
        {showComments && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowComments(false)}>
            <div
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-background shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
                <h3 className="text-base font-semibold">Comments</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComments(false)}
                  className="h-8 w-8 rounded-full hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <ScrollArea className="flex-1 bg-background">
                <div className="px-4 py-3">
                  {currentVideo && <CommentThread videoId={currentVideo.id} isShorts />}
                </div>
              </ScrollArea>

              {/* Comment Input - Fixed at bottom */}
              <div className="border-t bg-background px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={currentUploader?.avatarUrl} />
                    <AvatarFallback>{currentUploader?.name[0]}</AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button className="text-xs font-semibold text-muted-foreground">
                    😊
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
