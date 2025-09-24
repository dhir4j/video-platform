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

    return (
        <div className="h-full bg-black">
            <ShortVideoCarousel videos={shortVideos} startIndex={startIndex} />
        </div>
    )
}
