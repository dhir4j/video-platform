
import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';

export default function HomePage() {
  const allVideos = getVideos();
  const longVideos = allVideos.filter((v) => v.type === 'long');

  return (
    <div className="space-y-12">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {longVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
