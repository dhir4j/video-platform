import { Metadata } from 'next';
import { getAllArticles, getAllCategories } from '@/lib/articles';
import { VideoCard } from '@/components/videos/video-card';

export const metadata: Metadata = {
  title: 'All Videos | FruqVideos',
  description: 'Browse all videos on FruqVideos. Watch tutorials, guides, and educational content across various categories.',
  openGraph: {
    title: 'All Videos | FruqVideos',
    description: 'Browse all videos on FruqVideos. Watch tutorials, guides, and educational content across various categories.',
    type: 'website',
  },
};

export default function VideosPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Videos</h1>
        <p className="text-muted-foreground text-lg">
          Browse {articles.length} videos across {categories.length} categories
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/videos"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            All
          </a>
          {categories.map((category) => (
            <a
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <VideoCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
