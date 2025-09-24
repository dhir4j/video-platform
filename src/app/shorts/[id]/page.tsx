
import { getVideos } from "@/lib/data"
import { ShortVideoCarousel } from "@/components/video/short-video-carousel";
import { notFound } from "next/navigation";

export default function ShortsPage({ params }: { params: { id: string } }) {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    const startIndex = shortVideos.findIndex(v => v.id === params.id);

    if (startIndex === -1) {
        notFound();
    }

    // It's important to pass all short videos to the carousel
    // so it can handle swiping between them.
    return (
        <div className="h-full w-full">
            <ShortVideoCarousel videos={shortVideos} startIndex={startIndex} />
        </div>
    )
}
