"use client";

import { useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import { getVideos } from "@/lib/data";
import type { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ShortsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    
    // Fetch all videos and filter for shorts
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    // Find the index of the current video
    const currentIndex = shortVideos.findIndex(v => v.id === params.id);

    // If the video doesn't exist or isn't a short, show 404
    if (currentIndex === -1) {
        notFound();
    }

    const currentVideo = shortVideos[currentIndex];

    // Determine the next and previous videos
    const prevVideo = currentIndex > 0 ? shortVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < shortVideos.length - 1 ? shortVideos[currentIndex + 1] : null;
    
    const goToPrev = () => {
        if (prevVideo) {
            router.push(`/shorts/${prevVideo.id}`);
        }
    };

    const goToNext = () => {
        if (nextVideo) {
            router.push(`/shorts/${nextVideo.id}`);
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                goToPrev();
            } else if (e.key === 'ArrowDown') {
                goToNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [prevVideo, nextVideo]);

    // Handle touch/swipe navigation for mobile
    useEffect(() => {
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (touchStartY - touchEndY > 50) { // Swipe up
                goToNext();
            } else if (touchEndY - touchStartY > 50) { // Swipe down
                goToPrev();
            }
        };
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        }
    }, [nextVideo, prevVideo]);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Video Player Container */}
            <div className="relative w-full h-full max-w-md aspect-[9/16] mx-auto">
                 <Image
                    src={currentVideo.thumbnailUrl}
                    alt={currentVideo.title}
                    fill
                    className="object-contain"
                    data-ai-hint="portrait model"
                    priority={true}
                />
                <div className="absolute bottom-4 left-4 text-white z-10 bg-black/50 p-2 rounded-md">
                    <h3 className="font-bold">{currentVideo.title}</h3>
                    <p className="text-sm text-gray-300">{currentVideo.uploaderId}</p>
                </div>
            </div>
            
            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex flex-col gap-2 absolute right-4 top-1/2 -translate-y-1/2 z-10">
                <Button onClick={goToPrev} size="icon" variant="secondary" disabled={!prevVideo}>
                    <ChevronUp className="h-6 w-6"/>
                    <span className="sr-only">Previous video</span>
                </Button>
                <Button onClick={goToNext} size="icon" variant="secondary" disabled={!nextVideo}>
                    <ChevronDown className="h-6 w-6"/>
                    <span className="sr-only">Next video</span>
                </Button>
            </div>
        </div>
    );
}
