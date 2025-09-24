
import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUser } from '@/lib/data';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { PlayCircle } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  orientation?: 'vertical' | 'horizontal';
}

export function VideoCard({ video, orientation = 'horizontal' }: VideoCardProps) {
  const uploader = getUser(video.uploaderId);
  const linkHref = video.type === 'short' ? `/shorts/${video.id}` : `/watch/${video.id}`;

  const isVertical = orientation === 'vertical';

  return (
    <Link href={linkHref} className="group">
      <Card className={cn("overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50", isVertical ? "flex flex-col" : "")}>
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={isVertical ? 360 : 640}
              height={isVertical ? 640 : 360}
              className={cn(
                "object-cover w-full transition-transform duration-300 group-hover:scale-105", 
                isVertical ? "aspect-[9/16]" : "aspect-video"
              )}
              data-ai-hint={video.type === 'short' ? 'portrait model' : 'abstract neon'}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
               <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            </div>
            
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
              <Badge variant="default" className="absolute top-2 left-2 bg-primary text-primary-foreground">Short</Badge>
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                1:23
            </div>
          </div>
          {!isVertical && (
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">{video.title}</h3>
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
