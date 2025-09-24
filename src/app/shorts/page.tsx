import { getVideos } from "@/lib/data";
import { ShortVideoCarousel } from "@/components/video/short-video-carousel";

export default function AllShortsPage() {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    return (
        <div className="fixed inset-0 bg-black z-50">
            <ShortVideoCarousel videos={shortVideos} startIndex={0} />
        </div>
    )
}
