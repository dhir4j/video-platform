
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { VideoCard } from '@/components/video/video-card';
import { getVideos } from '@/lib/data';

export default function HomePage() {
  const allVideos = getVideos();
  const shortVideos = allVideos.filter((v) => v.type === 'short');
  const longVideos = allVideos.filter((v) => v.type === 'long');

  return (
    <div className="space-y-8">
      <section className="hidden md:block">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Trending Shorts</h2>
        <Carousel 
          opts={{ align: 'start', loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {shortVideos.map((video) => (
              <CarouselItem key={video.id} className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <VideoCard video={video} orientation="vertical" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4 md:hidden">Videos</h2>
        <h2 className="text-2xl font-bold tracking-tight mb-4 hidden md:block">Newest Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {longVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
