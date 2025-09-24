"use client";

import { getVideos } from "@/lib/data";
import { notFound } from 'next/navigation';
import { ShortsPlayer } from "@/components/video/shorts-player";

export default function ShortsPage({ params }: { params: { id: string } }) {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    const startIndex = shortVideos.findIndex(v => v.id === params.id);

    if (startIndex === -1) {
        notFound();
    }

    // The new ShortsPlayer component will now handle the UI and transitions.
    return (
      <ShortsPlayer videos={shortVideos} startIndex={startIndex} />
    )
}
