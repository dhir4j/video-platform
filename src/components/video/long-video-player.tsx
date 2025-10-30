import Image from 'next/image';
import type { Video, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Maximize,
  Volume2,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  Rss
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '../ui/separator';

interface LongVideoPlayerProps {
  video: Video;
  uploader?: User;
}

export function LongVideoPlayer({ video, uploader }: LongVideoPlayerProps) {
  return (
    <div className="space-y-5">
      {/* Video Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-contain"
          data-ai-hint="abstract neon"
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Play className="relative w-20 h-20 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <Progress value={33} className="h-2 rounded-full" />
          <div className="flex items-center justify-between mt-3 text-white">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <Play className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <Volume2 className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">1:23 / 4:56</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Card */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg p-5 space-y-4">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight leading-tight">{video.title}</h1>

        {/* Stats and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              {video.likes.toLocaleString()} views
            </span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary">
              <ThumbsUp className="mr-2 h-4 w-4" />
              {video.likes.toLocaleString()}
            </Button>
            <Button variant="outline" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
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

        {/* Channel Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {uploader?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">{uploader?.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                1.2M Subscribers
              </p>
            </div>
          </div>
          <Button className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Rss className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-lg p-5 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-primary"></span>
          About this video
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>

        {video.tags.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {video.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all rounded-full px-3 py-1 text-xs font-medium"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
