import Link from 'next/link';
import { getAllArticles, getAllCategories } from '@/lib/articles';
import { VideoCard } from '@/components/videos/video-card';

export default function HomePage() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const featuredArticles = articles.slice(0, 12); // Show first 12 articles on homepage

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to FruqVideos
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing video content across {categories.length} categories.
          Watch tutorials, guides, and educational videos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/videos"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Browse All Videos
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            Explore Categories
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="p-6 bg-card border rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-lg">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Videos */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Videos</h2>
          <Link
            href="/videos"
            className="text-primary hover:underline font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredArticles.map((article) => (
            <VideoCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
