
import { getVideos } from "@/lib/data";
import { VideoCard } from "@/components/video/video-card";

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
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[20.5rem]">
            <div className="grid grid-cols-1 gap-8 py-4">
                {shortVideos.map((video) => (
                    <VideoCard key={video.id} video={video} orientation="vertical" />
                ))}
            </div>
        </div>
      </div>
    )
}
