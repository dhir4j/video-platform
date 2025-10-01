
import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';
import { PremiumSection } from '@/components/video/premium-section';

export default function HomePage() {
  const allVideos = getVideos();
  const longVideos = allVideos.filter((v) => v.type === 'long');
  const premiumVideos = allVideos.filter((v) => v.isPremium);

  // Split videos to insert the premium section
  const videosBeforePremium = longVideos.slice(0, 4);
  const videosAfterPremium = longVideos.slice(4);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videosBeforePremium.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section>
        <PremiumSection videos={premiumVideos.slice(0, 5)} />
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videosAfterPremium.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
