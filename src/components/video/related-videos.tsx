"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/types';
import { getUser } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Eye, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RelatedVideosProps {
  videos: Video[];
  compact?: boolean;
}

export function RelatedVideos({ videos, compact = false }: RelatedVideosProps) {
  if (compact && videos.length === 1) {
    const video = videos[0];
    const uploader = getUser(video.uploaderId);
    const linkHref = video.type === 'short' ? `/shorts/${video.id}` : `/watch/${video.id}`;

    return (
      <Link href={linkHref} className="group block">
        <div className="flex gap-2 rounded-lg overflow-hidden hover:bg-muted/50 transition-all p-2">
          <div className="relative w-40 shrink-0">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={160}
              height={90}
              className="object-cover w-full h-full rounded-md aspect-video"
              data-ai-hint="abstract neon"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-semibold px-1 py-0.5 rounded">
              4:56
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{uploader?.name}</p>
            <p className="text-xs text-muted-foreground">{video.likes.toLocaleString()} views</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">More Videos You Might Like</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {videos.map((video) => {
          const uploader = getUser(video.uploaderId);
          const linkHref = video.type === 'short' ? `/shorts/${video.id}` : `/watch/${video.id}`;

          return (
            <Link
              key={video.id}
              href={linkHref}
              className="group block"
            >
              <div className="rounded-lg overflow-hidden border border-transparent hover:border-primary/50 transition-all bg-card/30 hover:bg-card/60 hover:shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="abstract neon"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                    <Clock className="h-3 w-3 inline mr-0.5" />
                    4:56
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={uploader?.avatarUrl} alt={uploader?.name} />
                      <AvatarFallback>{uploader?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {uploader?.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Eye className="h-3 w-3" />
                        <span>{video.likes.toLocaleString()}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
