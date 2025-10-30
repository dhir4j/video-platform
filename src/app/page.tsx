"use client";

import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Rows3 } from 'lucide-react';

export default function HomePage() {
  const allVideos = getVideos();
  const longVideos = allVideos.filter((v) => v.type === 'long');
  const [layoutMode, setLayoutMode] = useState<'single' | 'double'>('single');

  return (
    <div className="space-y-6">
      {/* Layout Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Videos</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Layout:</span>
          <Button
            variant={layoutMode === 'single' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutMode('single')}
            className="gap-2"
          >
            <Rows3 className="h-4 w-4" />
            <span className="hidden sm:inline">Single</span>
          </Button>
          <Button
            variant={layoutMode === 'double' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutMode('double')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
        </div>
      </div>

      <section>
        <div className={`grid gap-x-4 gap-y-6 ${
          layoutMode === 'single'
            ? 'grid-cols-1'
            : 'grid-cols-2 lg:grid-cols-3'
        }`}>
          {longVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
