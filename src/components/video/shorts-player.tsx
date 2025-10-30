
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
import { Heart, MessageCircle, Send, BookmarkPlus, Volume2, VolumeX, X, Play, Pause } from 'lucide-react';
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

  // Touch and wheel navigation
  const touchStartY = React.useRef<number>(0);
  const touchEndY = React.useRef<number>(0);

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    if (!api || showComments) return;

    const deltaY = touchStartY.current - touchEndY.current;
    const threshold = 50; // minimum swipe distance

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swiped up - next video
        api.scrollNext();
      } else {
        // Swiped down - previous video
        api.scrollPrev();
      }
    }
  }, [api, showComments]);

  const handleWheel = React.useCallback((e: WheelEvent) => {
    if (!api || isScrolling.current || showComments) return;

    e.preventDefault();

    if (Math.abs(e.deltaY) > 30) {
      isScrolling.current = true;

      if (e.deltaY > 0) {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  }, [api, showComments]);

  React.useEffect(() => {
    const container = document.getElementById('shorts-container');
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (showComments) return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        api?.scrollPrev();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        api?.scrollNext();
      }
    },
    [api, showComments]
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
                skipSnaps: true,
                dragFree: false,
                watchDrag: false,
            }}
        >
          <CarouselContent className="h-full -mt-0">
              {videos.map((video, index) => {
                const uploader = getUser(video.uploaderId);
                const isActive = index === currentIndex;
                return (
                  <CarouselItem key={video.id} className="pt-0 relative h-full min-h-full basis-full">
                     <div className="relative w-full h-full flex items-center justify-center bg-black">
                        {/* Main Content Container */}
                        <div className="flex items-center justify-center w-full h-full max-w-7xl mx-auto px-0 lg:px-20">
                            {/* Video Container */}
                            <div className="relative w-full h-full max-w-[450px] lg:max-w-[500px]">
                                {/* Video Element */}
                                <video
                                    ref={(el) => {
                                      if (el) {
                                        videoRefs.current.set(video.id, el);
                                      }
                                    }}
                                    src={video.videoUrl || `https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg`}
                                    poster={video.thumbnailUrl || `https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg`}
                                    className="w-full h-full object-cover cursor-pointer rounded-lg lg:rounded-xl"
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    preload="metadata"
                                    onClick={handleVideoClick}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-lg lg:rounded-xl"></div>

                                {/* Mute/Unmute Button */}
                                <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMute();
                                    }}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 text-white hover:bg-white/20 z-20 rounded-full backdrop-blur-sm bg-black/20 transition-all duration-200 hover:scale-110"
                                >
                                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </Button>

                                {/* Video Info Overlay - Mobile */}
                                <div className="lg:hidden absolute bottom-4 left-4 right-20 text-white z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Avatar className="h-9 w-9 border-2 border-white ring-2 ring-black/20">
                                        <AvatarImage src={uploader?.avatarUrl} />
                                        <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <p className="font-semibold text-sm">{uploader?.name}</p>
                                    </div>
                                    <h3 className="font-bold text-base mb-1.5">{video.title}</h3>
                                    <p className={`text-xs text-gray-200 ${showDescription && isActive ? '' : 'line-clamp-2'}`}>
                                      {video.description}
                                    </p>
                                    {!showDescription && isActive && (
                                      <button
                                        onClick={handleVideoClick}
                                        className="text-xs text-gray-400 hover:text-white mt-1"
                                      >
                                        ...more
                                      </button>
                                    )}
                                </div>

                                {/* Action Buttons - Mobile (Inside) */}
                                <div className="lg:hidden absolute bottom-4 right-3 text-white z-10 flex flex-col items-center gap-5">
                                    <button
                                      className="flex flex-col items-center gap-1 group transition-transform hover:scale-110"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="rounded-full bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/20 transition-all">
                                            <Heart className="h-6 w-6 fill-white" />
                                        </div>
                                        <span className="text-xs font-semibold">{formatCount(video.likes)}</span>
                                    </button>
                                    <button
                                      className="flex flex-col items-center gap-1 group transition-transform hover:scale-110"
                                      onClick={handleCommentsClick}
                                    >
                                        <div className="rounded-full bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/20 transition-all">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <span className="text-xs font-semibold">{formatCount(video.commentsCount)}</span>
                                    </button>
                                    <button
                                      className="flex flex-col items-center gap-1 group transition-transform hover:scale-110"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="rounded-full bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/20 transition-all">
                                            <Send className="h-6 w-6" />
                                        </div>
                                    </button>
                                    <button
                                      className="flex flex-col items-center gap-1 group transition-transform hover:scale-110"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="rounded-full bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/20 transition-all">
                                            <BookmarkPlus className="h-6 w-6" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons - Desktop (Outside, Right Side) */}
                            <div className="hidden lg:flex flex-col items-center gap-6 ml-8 text-white">
                                <button
                                  className="flex flex-col items-center gap-2 group transition-all hover:scale-105"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="rounded-full bg-white/10 backdrop-blur-md p-3.5 group-hover:bg-white/20 transition-all shadow-lg">
                                        <Heart className="h-7 w-7 fill-white stroke-white" />
                                    </div>
                                    <span className="text-sm font-semibold">{formatCount(video.likes)}</span>
                                </button>
                                <button
                                  className="flex flex-col items-center gap-2 group transition-all hover:scale-105"
                                  onClick={handleCommentsClick}
                                >
                                    <div className="rounded-full bg-white/10 backdrop-blur-md p-3.5 group-hover:bg-white/20 transition-all shadow-lg">
                                        <MessageCircle className="h-7 w-7" />
                                    </div>
                                    <span className="text-sm font-semibold">{formatCount(video.commentsCount)}</span>
                                </button>
                                <button
                                  className="flex flex-col items-center gap-2 group transition-all hover:scale-105"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="rounded-full bg-white/10 backdrop-blur-md p-3.5 group-hover:bg-white/20 transition-all shadow-lg">
                                        <Send className="h-7 w-7" />
                                    </div>
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                                <button
                                  className="flex flex-col items-center gap-2 group transition-all hover:scale-105"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="rounded-full bg-white/10 backdrop-blur-md p-3.5 group-hover:bg-white/20 transition-all shadow-lg">
                                        <BookmarkPlus className="h-7 w-7" />
                                    </div>
                                    <span className="text-sm font-medium">Save</span>
                                </button>
                            </div>

                            {/* Video Info - Desktop (Below video) */}
                            <div className="hidden lg:block absolute bottom-4 left-4 right-4 text-white z-10" style={{ maxWidth: '500px' }}>
                                <div className="flex items-center gap-3 mb-3">
                                  <Avatar className="h-11 w-11 border-2 border-white ring-2 ring-black/20">
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
                        </div>
                    </div>
                  </CarouselItem>
                )
              })}
          </CarouselContent>
        </Carousel>

        {/* Comments Bottom Sheet - YouTube Shorts Style */}
        {showComments && (
          <>
            {/* Backdrop with blur on video */}
            <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowComments(false)}>
              <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            {/* Bottom Sheet */}
            <div
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300"
              style={{ height: 'calc(60vh)', maxHeight: '600px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-center py-3 border-b">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="text-sm font-semibold">Comments {currentVideo?.commentsCount ? `(${currentVideo.commentsCount})` : ''}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComments(false)}
                  className="h-7 w-7 rounded-full hover:bg-secondary"
                >
                  <X className="h-3.5 w-3.5" />
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
          </>
        )}
    </div>
  )
}
