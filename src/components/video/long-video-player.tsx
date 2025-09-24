import Image from 'next/image';
import type { Video, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Maximize,
  Volume2,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface LongVideoPlayerProps {
  video: Video;
  uploader?: User;
}

export function LongVideoPlayer({ video, uploader }: LongVideoPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-contain"
          data-ai-hint="abstract neon"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Play className="w-20 h-20 text-white/70" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <Progress value={33} className="h-1.5" />
            <div className="flex items-center justify-between mt-2 text-white">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10"><Play /></Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10"><Volume2 /></Button>
                    <span className="text-xs">1:23 / 4:56</span>
                </div>
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10"><Maximize /></Button>
                </div>
            </div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight">{video.title}</h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
            <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{uploader?.name}</p>
            <p className="text-sm text-muted-foreground">{video.uploaderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <ThumbsUp className="mr-2 h-4 w-4" /> {video.likes.toLocaleString()}
            </Button>
            <Button variant="outline" size="icon">
                <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-secondary/50">
        <p className="text-sm text-muted-foreground">{new Date(video.createdAt).toDateString()} • {video.country}</p>
        <p className="mt-2">{video.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {video.tags.map(tag => (
            <Badge key={tag} variant="secondary">#{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
