import Link from 'next/link';
import { Article, getArticleSlug } from '@/lib/articles';

interface VideoCardProps {
  article: Article;
}

export function VideoCard({ article }: VideoCardProps) {
  const slug = getArticleSlug(article);

  return (
    <Link href={`/videos/${slug}`} className="group block">
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {article.video_duration}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.body}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {article.category.map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-secondary rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
