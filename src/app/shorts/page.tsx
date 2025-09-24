
import { getVideos } from "@/lib/data";
import { ShortVideoCarousel } from "@/components/video/short-video-carousel";

export default function AllShortsPage() {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    if (shortVideos.length === 0) {
        return (
            <div className="h-full bg-black flex items-center justify-center text-white">
                <p>No shorts available.</p>
            </div>
        )
    }

    return (
      <ShortVideoCarousel videos={shortVideos} />
    )
}
