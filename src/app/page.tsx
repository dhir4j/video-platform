import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';

export default function HomePage() {
  const allVideos = getVideos();
  const longVideos = allVideos.filter((v) => v.type === 'long');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Videos</h2>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {longVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
