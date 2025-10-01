
import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';
import { PremiumSection } from '@/components/video/premium-section';

export default function HomePage() {
  const allVideos = getVideos();
  const longVideos = allVideos.filter((v) => v.type === 'long');
  
  // Take the first 6 videos for the main grid
  const mainVideos = longVideos.slice(0, 6);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section>
        <PremiumSection />
      </section>
    </div>
  );
}
