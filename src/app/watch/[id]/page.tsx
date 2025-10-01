import { notFound } from 'next/navigation';
import { getVideo, getVideos, getUser } from '@/lib/data';
import { LongVideoPlayer } from '@/components/video/long-video-player';
import { CommentThread } from '@/components/comments/comment-thread';
import { VideoCard } from '@/components/video/video-card';
import { Separator } from '@/components/ui/separator';

export default function WatchPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const video = getVideo(id);
  
  if (!video || video.type !== 'long') {
    notFound();
  }

  const uploader = getUser(video.uploaderId);
  const upNextVideos = getVideos().filter(v => v.id !== video.id && v.type === 'long').slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <LongVideoPlayer video={video} uploader={uploader} />
          <Separator className="my-8" />
          <CommentThread videoId={video.id} />
        </div>
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Up Next</h2>
          <div className="space-y-4">
            {upNextVideos.map(nextVideo => (
              <VideoCard key={nextVideo.id} video={nextVideo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
