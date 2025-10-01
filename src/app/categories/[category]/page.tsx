import { getVideos } from "@/lib/data";
import { VideoCard } from "@/components/video/video-card";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const allVideos = getVideos();

  const filteredVideos = allVideos.filter((video) =>
    video.tags.some((tag) => tag.toLowerCase() === category.toLowerCase())
  );

  // Capitalize first letter for display
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName} Videos</h1>
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-64">
            <h2 className="text-2xl font-semibold">No Videos Found</h2>
            <p className="text-muted-foreground mt-2">There are currently no videos in the "{categoryName}" category.</p>
        </div>
      )}
    </div>
  );
}
