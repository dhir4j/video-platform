
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Shorts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {shortVideos.map((video) => (
                <VideoCard key={video.id} video={video} orientation="vertical" />
            ))}
        </div>
      </div>
    )
}
