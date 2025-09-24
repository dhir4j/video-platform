"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MoreVertical, ArrowLeft } from "lucide-react"

import type { Video } from "@/lib/types"
import { getUser } from "@/lib/data"
import { CommentThread } from "../comments/comment-thread"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShortVideoCarouselProps {
    videos: Video[];
    startIndex?: number;
}

export function ShortVideoCarousel({ videos, startIndex = 0 }: ShortVideoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const router = useRouter();

  React.useEffect(() => {
    if (!api) {
      return
    }

    const handleSelect = (api: CarouselApi) => {
      const selectedVideoId = videos[api.selectedScrollSnap()].id;
      // Use replaceState to update URL without triggering a re-render/navigation
      window.history.replaceState(null, '', `/shorts/${selectedVideoId}`)
    };
    
    api.on("select", handleSelect);

    // Initial scroll to start index if provided
    if(startIndex > 0 && api.scrollSnapList().length > startIndex) {
        api.scrollTo(startIndex, true); // `true` for instant jump
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

  return (
    <div className="h-full w-full relative bg-black">
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
            {videos.map((video, index) => {
                const uploader = getUser(video.uploaderId)
                return (
                    <CarouselItem key={video.id} className="pt-0 relative h-full">
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            {/* Dummy Placeholder */}
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <span className="text-white text-2xl">Video {index + 1}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        </div>

                        <div className={cn("absolute top-6 left-4 z-20", router.asPath === '/shorts' ? 'md:hidden' : '')}>
                            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={() => router.back()}>
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="absolute bottom-20 left-4 right-4 text-white z-10 space-y-3">
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={uploader?.avatarUrl} />
                                        <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold">{uploader?.name}</h3>
                                    </div>
                                </Link>
                                <Button size="sm" variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-black">Follow</Button>
                            </div>
                            <p className="text-sm">{video.description}</p>
                        </div>

                        <div className="absolute bottom-20 right-2 flex flex-col items-center gap-4 z-10">
                            <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-white hover:text-primary">
                                <Heart className="w-8 h-8"/>
                                <span className="text-xs font-bold">{video.likes.toLocaleString()}</span>
                            </Button>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-white hover:text-accent">
                                        <MessageCircle className="w-8 h-8"/>
                                        <span className="text-xs font-bold">{video.commentsCount.toLocaleString()}</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0">
                                    <SheetHeader className="p-4 border-b">
                                        <SheetTitle>Comments</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <CommentThread videoId={video.id} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-white">
                                <Share2 className="w-8 h-8"/>
                                <span className="text-xs font-bold">{video.shares.toLocaleString()}</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white">
                                    <MoreVertical className="w-8 h-8"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Flag className="mr-2 h-4 w-4" />
                                    Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CarouselItem>
                )
            })}
        </CarouselContent>
        </Carousel>
    </div>
  )
}
