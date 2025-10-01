
import { getVideos } from "@/lib/data";
import { ShortsPlayer } from "@/components/video/shorts-player";

export default function AllShortsPage() {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    if (shortVideos.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p>No shorts available.</p>
            </div>
        )
    }

    return (
      <div className="w-full h-full">
        <ShortsPlayer videos={shortVideos} />
      </div>
    )
}
