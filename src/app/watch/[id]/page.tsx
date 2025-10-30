import { notFound } from 'next/navigation';
import { getVideo, getVideos, getUser } from '@/lib/data';
import { LongVideoPlayer } from '@/components/video/long-video-player';
import { CommentSection } from '@/components/comments/comment-section';
import { RelatedVideos } from '@/components/video/related-videos';

export default function WatchPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const video = getVideo(id);

  if (!video || video.type !== 'long') {
    notFound();
  }

  const uploader = getUser(video.uploaderId);
  const relatedVideos = getVideos().filter(v => v.id !== video.id && v.type === 'long').slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-2 md:px-4 py-3 md:py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
          {/* Main Content */}
          <div className="w-full lg:w-[70%] space-y-3 md:space-y-6">
            <LongVideoPlayer video={video} uploader={uploader} />

            {/* Comments Section with Dropdown */}
            <CommentSection videoId={video.id} />

            {/* Related Videos Below Comments */}
            <RelatedVideos videos={relatedVideos} />
          </div>

          {/* Sidebar - Quick Access Related Videos */}
          <div className="w-full lg:w-[30%]">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-lg">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary"></span>
                  Quick Access
                </h2>
                <div className="space-y-3">
                  {relatedVideos.slice(0, 5).map(nextVideo => (
                    <RelatedVideos key={nextVideo.id} videos={[nextVideo]} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
