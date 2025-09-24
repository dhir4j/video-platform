
import { getVideos } from "@/lib/data";
import { redirect } from "next/navigation";

// This page now acts as an entry point to the shorts feed.
// It finds the first short video and redirects to its dedicated page.
export default function AllShortsPage() {
    const allVideos = getVideos();
    const firstShort = allVideos.find(v => v.type === 'short');
    
    if (firstShort) {
        redirect(`/shorts/${firstShort.id}`);
    }

    // If there are no short videos, show a message.
    // This could be styled better in a real app.
    return (
        <div className="h-full bg-black flex items-center justify-center text-white">
            <p>No shorts available.</p>
        </div>
    )
}
