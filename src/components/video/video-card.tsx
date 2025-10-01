
'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PlayCircle, Heart, MessageCircle, Share2, Maximize, Minimize, Gem, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CommentThread } from '../comments/comment-thread';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '../ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

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
      // The onClick handler is wrapped to prevent navigation while allowing the trigger to work.
      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <Trigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10">
                <MessageCircle className="h-7 w-7"/>
                <span className="text-xs font-bold">{video.commentsCount}</span>
            </Button>
        </Trigger>
      </div>
    )
  }
  
  return (
    <Link href={linkHref} className="group flex flex-col h-full">
      <Card
        ref={cardRef}
        className={cn(
          "overflow-hidden h-full transition-shadow duration-300 bg-card rounded-xl",
          "flex flex-col p-3"
        )}
      >
        <CardContent className="p-0 flex-1 flex flex-col">
            <div className="relative mb-3">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={isVertical ? 360 : 640}
                height={isVertical ? 640 : 360}
                className={cn(
                  "object-cover w-full transition-transform duration-300 group-hover:scale-105 rounded-lg", 
                  isVertical ? "aspect-[9/16]" : "aspect-video",
                  isFullscreen ? "object-contain h-screen rounded-none" : ""
                )}
                data-ai-hint={video.type === 'short' ? 'portrait model' : 'abstract neon'}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-lg">
                 <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100" />
              </div>

              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded-md">
                  1:23
              </div>
              
              {isVertical ? (
                <>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <h3 className="font-semibold text-base leading-tight truncate text-white group-hover:text-primary transition-colors">{video.title}</h3>
                  </div>
                  {video.type === 'short' && (
                     <div className="absolute bottom-16 right-2 text-white z-10 flex flex-col items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-1 text-white hover:bg-white/10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
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
                        
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <Share2 className="h-7 w-7"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10" onClick={handleFullscreen}>
                            {isFullscreen ? <Minimize className="h-7 w-7"/> : <Maximize className="h-7 w-7"/>}
                        </Button>
                    </div>
                  )}
                </>
              ) : null}

              {video.isPremium && !isVertical && (
                <Badge variant="default" className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-500 to-purple-600 border-0 shadow-lg">
                  <Gem className="mr-1.5 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>

            <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
                <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                  <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{uploader?.name}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <span>{video.likes.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                  </div>
              </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Add to queue</DropdownMenuItem>
                  <DropdownMenuItem>Save to Watch Later</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
