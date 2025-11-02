# Frontend Integration Guide

This guide shows how to integrate your frontend application (running on `frontendwebsite.com`) with the backend API (running on `myserverwebsite.com`).

## Table of Contents

1. [Configuration](#configuration)
2. [API Client Setup](#api-client-setup)
3. [React/Next.js Examples](#reactnextjs-examples)
4. [TypeScript Types](#typescript-types)
5. [Complete Integration Flow](#complete-integration-flow)

## Configuration

### Backend Configuration

Update your backend `.env` file:

```env
# Backend server URL
BACKEND_URL=https://myserverwebsite.com

# Frontend URL (for CORS and SEO)
FRONTEND_URL=https://frontendwebsite.com

# CORS origins (comma-separated for multiple domains)
CORS_ORIGINS=https://frontendwebsite.com,https://www.frontendwebsite.com

# Enable automation
AUTO_PROCESS_ENABLED=True
CHECK_INTERVAL_MINUTES=5
```

### Frontend Configuration

Create a `.env.local` file in your Next.js frontend:

```env
NEXT_PUBLIC_API_URL=https://myserverwebsite.com/api
```

## API Client Setup

### Create an API Client (lib/api.ts)

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Post {
  id: number;
  page_number: number;
  article_number: number;
  url: string;
  slug: string;
  title: string;
  body: string;
  thumbnail: string;
  video_url: string;
  video_width: number;
  video_height: number;
  video_duration: string;
  video_duration_seconds: number;
  video_type: string;
  categories: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  structured_data: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Fetch posts with optional filters
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    published?: boolean;
    search?: string;
  }): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.published !== undefined) queryParams.append('published', params.published.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseURL}/posts?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch a single post by ID
   */
  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseURL}/posts/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<{ categories: Category[]; total: number }> {
    const response = await fetch(`${this.baseURL}/categories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get backend statistics
   */
  async getStats(): Promise<any> {
    const response = await fetch(`${this.baseURL}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new APIClient();
```

## React/Next.js Examples

### 1. Homepage - Display Latest Posts

```typescript
// app/page.tsx (Next.js 13+ App Router)
import { api } from '@/lib/api';

export default async function HomePage() {
  const { posts } = await api.getPosts({ page: 1, per_page: 12, published: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Videos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// components/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/api';

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/watch/${post.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {post.video_duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {post.body}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### 2. Video Page - Display Single Post

```typescript
// app/watch/[slug]/page.tsx
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    // In a real app, you'd fetch by slug. This example uses ID
    // You may need to add a getPostBySlug method to your API
    const post = await api.getPost(parseInt(params.slug));

    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.body,
      keywords: post.meta_keywords,
      openGraph: {
        title: post.title,
        description: post.body,
        images: [post.thumbnail],
        type: 'video.other',
      },
    };
  } catch {
    return {
      title: 'Video Not Found',
    };
  }
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  let post;

  try {
    post = await api.getPost(parseInt(params.slug));
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Video Player */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <video
            controls
            className="w-full h-full"
            poster={post.thumbnail}
            src={post.video_url}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
            >
              {category}
            </Link>
          ))}
        </div>

        <p className="text-gray-700 mb-6">{post.body}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Structured Data for SEO */}
        {post.structured_data && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(post.structured_data),
            }}
          />
        )}
      </div>
    </div>
  );
}
```

### 3. Category Page

```typescript
// app/categories/[category]/page.tsx
import { api } from '@/lib/api';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  const { posts } = await api.getPosts({ category, published: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{category} Videos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { categories } = await api.getCategories();

  return categories.map((category) => ({
    category: category.slug,
  }));
}
```

### 4. Search Functionality

```typescript
// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { api, Post } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchPosts() {
      if (!query) {
        setPosts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { posts } = await api.getPosts({ search: query, published: true });
        setPosts(posts);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }

    searchPosts();
  }, [query]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <>
          <p className="text-gray-600 mb-6">{posts.length} results found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

### 5. Categories Sidebar

```typescript
// components/CategoriesSidebar.tsx
import Link from 'next/link';
import { api } from '@/lib/api';

export async function CategoriesSidebar() {
  const { categories } = await api.getCategories();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Categories</h2>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categories/${category.slug}`}
              className="flex justify-between items-center hover:text-blue-600 transition-colors"
            >
              <span>{category.name}</span>
              <span className="text-sm text-gray-500">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## TypeScript Types

Complete type definitions for your frontend:

```typescript
// types/api.ts

export interface Post {
  id: number;
  page_number: number;
  article_number: number;
  url: string;
  slug: string;
  title: string;
  body: string;
  thumbnail: string;
  video_url: string;
  video_width: number;
  video_height: number;
  video_duration: string;
  video_duration_seconds: number;
  video_type: string;
  categories: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  structured_data: VideoStructuredData | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
  embedUrl: string;
  keywords: string;
  genre?: string[];
  potentialAction?: {
    '@type': string;
    target: string;
  };
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface Stats {
  total_posts: number;
  published_posts: number;
  unpublished_posts: number;
  categories: number;
  category_distribution: Record<string, number>;
  recent_processing_logs: ProcessingLog[];
}

export interface ProcessingLog {
  id: number;
  started_at: string;
  completed_at: string | null;
  total_articles: number;
  processed_articles: number;
  created_posts: number;
  skipped_duplicates: number;
  errors: number;
  status: string;
  error_details: string | null;
}
```

## Complete Integration Flow

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Automation Script                        │
│  (Regularly scrapes data and updates scraped_pages.json)        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ 1. Updates JSON file
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              Backend (myserverwebsite.com)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  File Watcher / Scheduler                                │  │
│  │  - Monitors scraped_pages.json for changes every 5 mins  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                         │
│                        │ 2. Detects changes                      │
│                        ↓                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Post Processor                                          │  │
│  │  - Creates SEO-optimized posts                           │  │
│  │  - Skips duplicates                                      │  │
│  │  - Stores in database                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                         │
│                        │ 3. Posts stored in DB                   │
│                        ↓                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints                                      │  │
│  │  /api/posts, /api/categories, etc.                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 4. Frontend fetches data via API
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Frontend (frontendwebsite.com)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js Pages                                           │  │
│  │  - Homepage                                              │  │
│  │  - Video pages                                           │  │
│  │  - Category pages                                        │  │
│  │  - Search                                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        │                                         │
│                        │ 5. Displays posts to users              │
│                        ↓                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  User sees SEO-optimized video content                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

1. **Automation Script Runs**
   - Your Python script scrapes new video data
   - Updates `/data/scraped_pages.json`
   - (Optional) Calls webhook to trigger immediate processing

2. **Backend Auto-Processing**
   - File watcher detects changes in JSON file (every 5 minutes)
   - Post processor creates SEO-optimized entries
   - Duplicates are automatically skipped
   - Posts stored in SQLite database

3. **Frontend Requests Data**
   - User visits `frontendwebsite.com`
   - Next.js fetches posts from `myserverwebsite.com/api/posts`
   - CORS headers allow cross-origin requests

4. **Display to Users**
   - Posts rendered with SEO metadata
   - Structured data (JSON-LD) included for search engines
   - Videos playable directly on frontend

## Testing the Integration

1. **Test Backend API**:
   ```bash
   curl https://myserverwebsite.com/api/health
   curl https://myserverwebsite.com/api/posts?per_page=5
   ```

2. **Test from Frontend**:
   ```javascript
   // In browser console on frontendwebsite.com
   fetch('https://myserverwebsite.com/api/posts')
     .then(r => r.json())
     .then(console.log);
   ```

3. **Test Automation**:
   ```bash
   python automation_example.py
   ```

## Production Checklist

- [ ] Update `.env` files with production URLs
- [ ] Enable HTTPS for both frontend and backend
- [ ] Configure CORS_ORIGINS with actual frontend domain
- [ ] Set AUTO_PROCESS_ENABLED=True
- [ ] Test webhook from automation script
- [ ] Verify SEO metadata in production
- [ ] Test cross-origin requests
- [ ] Monitor logs for errors
- [ ] Set up error alerting
- [ ] Configure backup for database

## Need Help?

Check the logs:
- Backend: `backend/logs/post_processor.log`
- Frontend: Browser console and Next.js logs

Common issues:
1. **CORS errors**: Verify CORS_ORIGINS in backend config
2. **API connection failed**: Check NEXT_PUBLIC_API_URL
3. **No posts showing**: Run `curl backend/api/posts` to verify data exists
4. **Automation not working**: Check automation status: `curl backend/api/automation/status`
