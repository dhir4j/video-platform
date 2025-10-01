
import { getVideos } from "@/lib/data";
import { ShortsPlayer } from "@/components/video/shorts-player";
import { notFound } from "next/navigation";

export default function ShortsIdPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const allVideos = getVideos();
  const shortVideos = allVideos.filter(v => v.type === 'short');
  
  const startIndex = shortVideos.findIndex(v => v.id === id);

  if (startIndex === -1) {
    notFound();
  }

  return (
    <div className="w-full h-full">
      <ShortsPlayer videos={shortVideos} startIndex={startIndex} />
    </div>
  );
}
