'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PlayCircle, Heart, MessageCircle, Share2, Maximize, Minimize } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CommentThread } from '../comments/comment-thread';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '../ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';

interface VideoCardProps {
  video: Video;
  orientation?: 'vertical' | 'horizontal';
}

export function VideoCard({ video, orientation = 'horizontal' }: VideoCardProps) {
  const uploader = getUser(video.uploaderId);
  const linkHref = video.type === 'short' ? `/shorts/${video.id}` : `/watch/${video.id}`;
  const isVertical = orientation === 'vertical';

  const cardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  const handleFullscreen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cardRef.current) return;

    if (!document.fullscreenElement) {
      cardRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const CommentSection = ({ isDrawer = false }: { isDrawer?: boolean }) => {
    const Header = isDrawer ? DrawerHeader : SheetHeader;
    const Title = isDrawer ? DrawerTitle : SheetTitle;
    return (
      <>
        <Header className="p-4 border-b">
          <Title>Comments ({video.commentsCount})</Title>
        </Header>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <CommentThread videoId={video.id} />
          </div>
        </ScrollArea>
      </>
    );
  }

  const CommentButton = ({isDrawer = false}: {isDrawer?: boolean}) => {
    const Trigger = isDrawer ? DrawerTrigger : SheetTrigger;
    return (
        <Trigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <MessageCircle className="h-7 w-7"/>
                <span className="text-xs font-bold">{video.commentsCount}</span>
            </Button>
        </Trigger>
    )
  }
  
  return (
    <Link href={linkHref} className="group">
      <Card
        ref={cardRef}
        className={cn(
          "overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50",
          isVertical ? "flex flex-col" : "",
          "bg-card"
        )}
      >
        <CardContent className="p-0">
            <div className="relative">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={isVertical ? 360 : 640}
                height={isVertical ? 640 : 360}
                className={cn(
                  "object-cover w-full transition-transform duration-300 group-hover:scale-105", 
                  isVertical ? "aspect-[9/16]" : "aspect-video",
                  isFullscreen ? "object-contain h-screen" : ""
                )}
                data-ai-hint={video.type === 'short' ? 'portrait model' : 'abstract neon'}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                 <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              </div>
              
              {isVertical && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold text-base leading-tight truncate text-white group-hover:text-primary transition-colors">{video.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
                        <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-white/80 truncate">{uploader?.name}</p>
                    </div>
                  </div>
                  {video.type === 'short' && (
                     <div className="absolute bottom-24 right-2 text-white z-10 flex flex-col items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10">
                            <Heart className="h-7 w-7"/>
                            <span className="text-xs font-bold">{video.likes > 1000 ? `${(video.likes/1000).toFixed(1)}k` : video.likes}</span>
                        </Button>

                        {isMobile ? (
                            <Drawer>
                                <CommentButton isDrawer />
                                <DrawerContent className="p-0 flex flex-col h-[90%] rounded-t-lg bg-background/80 backdrop-blur-sm">
                                    <CommentSection isDrawer/>
                                </DrawerContent>
                            </Drawer>
                        ) : (
                            <Sheet>
                                <CommentButton />
                                <SheetContent side="right" className="p-0 flex flex-col sm:max-w-md">
                                    <CommentSection />
                                </SheetContent>
                            </Sheet>
                        )}
                        
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10">
                            <Share2 className="h-7 w-7"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10" onClick={handleFullscreen}>
                            {isFullscreen ? <Minimize className="h-7 w-7"/> : <Maximize className="h-7 w-7"/>}
                        </Button>
                    </div>
                  )}
                </>
              )}

              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  1:23
              </div>
            </div>

          {!isVertical && (
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">{video.title}</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
                  <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground truncate">{uploader?.name}</p>
              </div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <span>{video.likes.toLocaleString()} likes</span>
                  <span>•</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
