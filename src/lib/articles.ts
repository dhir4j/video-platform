import scrapedData from '@/../../data/scraped_pages.json';

export interface Article {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  body: string;
  video: string;
  video_width: number;
  video_height: number;
  video_duration: string;
  video_duration_seconds: number;
  video_type: string;
  category: string[];
  tags?: string[];
  pageNumber: number;
  articleNumber: string;
}

export interface ScrapedPage {
  page_number: number;
  total_articles: number;
  scraped_articles: number;
  articles: {
    [key: string]: {
      url: string;
      thumbnail: string;
      title: string;
      body: string;
      video: string;
      video_width: number;
      video_height: number;
      video_duration: string;
      video_duration_seconds: number;
      video_type: string;
      category: string[];
      tags?: string[];
    };
  };
}

export interface ScrapedData {
  [pageNumber: string]: ScrapedPage;
}

/**
 * Get all articles from the scraped data
 */
export function getAllArticles(): Article[] {
  const data = scrapedData as ScrapedData;
  const articles: Article[] = [];

  Object.entries(data).forEach(([pageNumber, page]) => {
    Object.entries(page.articles).forEach(([articleNumber, article]) => {
      articles.push({
        ...article,
        id: `${pageNumber}-${articleNumber}`,
        pageNumber: parseInt(pageNumber),
        articleNumber,
      });
    });
  });

  return articles;
}

/**
 * Get a single article by ID (format: pageNumber-articleNumber)
 */
export function getArticleById(id: string): Article | null {
  const [pageNumber, articleNumber] = id.split('-');
  const data = scrapedData as ScrapedData;

  const page = data[pageNumber];
  if (!page || !page.articles[articleNumber]) {
    return null;
  }

  const article = page.articles[articleNumber];
  return {
    ...article,
    id,
    pageNumber: parseInt(pageNumber),
    articleNumber,
  };
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) =>
    article.category.some((cat) => cat.toLowerCase() === category.toLowerCase())
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const allArticles = getAllArticles();
  const categories = new Set<string>();

  allArticles.forEach((article) => {
    article.category.forEach((cat) => categories.add(cat));
  });

  return Array.from(categories).sort();
}

/**
 * Generate a URL-friendly slug from article title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get article slug (used for URL)
 */
export function getArticleSlug(article: Article): string {
  return `${generateSlug(article.title)}-${article.id}`;
}

/**
 * Extract article ID from slug
 */
export function extractIdFromSlug(slug: string): string | null {
  // Extract the ID from the end of the slug (format: title-pageNumber-articleNumber)
  const matches = slug.match(/(\d+-\d+)$/);
  return matches ? matches[1] : null;
}
