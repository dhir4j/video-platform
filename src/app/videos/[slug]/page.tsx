import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllArticles,
  getArticleById,
  extractIdFromSlug,
  getArticleSlug,
  Article,
} from '@/lib/articles';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles.map((article) => ({
    slug: getArticleSlug(article),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articleId = extractIdFromSlug(slug);

  if (!articleId) {
    return {
      title: 'Video Not Found',
    };
  }

  const article = getArticleById(articleId);

  if (!article) {
    return {
      title: 'Video Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fruqvideos.com';
  const articleUrl = `${siteUrl}/videos/${slug}`;

  return {
    title: article.title,
    description: article.body,
    keywords: article.tags?.join(', '),
    authors: [{ name: 'FruqVideos' }],
    openGraph: {
      title: article.title,
      description: article.body,
      url: articleUrl,
      siteName: 'FruqVideos',
      images: [
        {
          url: article.thumbnail,
          width: article.video_width,
          height: article.video_height,
          alt: article.title,
        },
      ],
      type: 'video.other',
      videos: [
        {
          url: article.video,
          width: article.video_width,
          height: article.video_height,
          type: 'video/mp4',
        },
      ],
    },
    twitter: {
      card: 'player',
      title: article.title,
      description: article.body,
      images: [article.thumbnail],
      players: [
        {
          playerUrl: article.video,
          streamUrl: article.video,
          width: article.video_width,
          height: article.video_height,
        },
      ],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { slug } = await params;
  const articleId = extractIdFromSlug(slug);

  if (!articleId) {
    notFound();
  }

  const article = getArticleById(articleId);

  if (!article) {
    notFound();
  }

  // Get related articles from the same category
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter(
      (a) =>
        a.id !== article.id &&
        a.category.some((cat) => article.category.includes(cat))
    )
    .slice(0, 6);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: article.title,
            description: article.body,
            thumbnailUrl: article.thumbnail,
            uploadDate: new Date().toISOString(), // You may want to add actual upload date to your data
            duration: `PT${Math.floor(article.video_duration_seconds)}S`,
            contentUrl: article.video,
            embedUrl: article.video,
            width: article.video_width,
            height: article.video_height,
            keywords: article.tags?.join(', '),
            genre: article.category.join(', '),
          }),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/videos" className="hover:text-foreground">
                Videos
              </Link>
            </li>
            {article.category[0] && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/categories/${article.category[0].toLowerCase()}`}
                    className="hover:text-foreground"
                  >
                    {article.category[0]}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
              <video
                className="w-full h-full"
                controls
                preload="metadata"
                poster={article.thumbnail}
              >
                <source src={article.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span>Duration: {article.video_duration}</span>
                <span>•</span>
                {article.category.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={`/categories/${cat.toLowerCase()}`}
                    className="px-3 py-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{article.body}</p>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs bg-muted rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {relatedArticles.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Related Videos</h2>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/videos/${getArticleSlug(related)}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-40 aspect-video flex-shrink-0 bg-muted rounded overflow-hidden">
                          <img
                            src={related.thumbnail}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {related.video_duration}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {related.category[0]}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
