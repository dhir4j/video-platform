import { getVideos } from "@/lib/data";
import { ShortVideoCarousel } from "@/components/video/short-video-carousel";
import { redirect } from "next/navigation";

export default function AllShortsPage() {
    const allVideos = getVideos();
    const shortVideos = allVideos.filter(v => v.type === 'short');
    
    if (shortVideos.length > 0) {
      redirect(`/shorts/${shortVideos[0].id}`);
    }

    return (
        <div className="h-full bg-black flex items-center justify-center text-white">
            <p>No shorts available.</p>
        </div>
    )
}
