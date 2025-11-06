# FruqVideos - Next.js Video Platform

A modern, SEO-optimized video platform built with Next.js 15, featuring dynamic article pages, automatic sitemap generation, and optimized for Google search visibility.

## Features

- **Dynamic Article Pages**: Individual pages for each video article with SEO optimization
- **Static Site Generation (SSG)**: All pages are statically generated at build time for optimal performance
- **SEO Optimized**:
  - Comprehensive meta tags (Open Graph, Twitter Cards)
  - JSON-LD structured data for videos
  - Automatic sitemap generation
  - robots.txt configuration
  - Optimized for Google search indexing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Category Organization**: Browse videos by category
- **Related Videos**: Automatic suggestions based on categories
- **Dark/Light Mode**: Theme toggle support
- **Performance Optimized**: Built with Next.js App Router for best performance

## Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Deployment**: Vercel (optimized)

## Project Structure

```
video-platform/
├── data/
│   └── scraped_pages.json      # Video article data source
├── src/
│   ├── app/
│   │   ├── videos/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx    # Dynamic video article pages
│   │   │   └── page.tsx        # All videos listing
│   │   ├── categories/         # Category pages (existing)
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── sitemap.ts          # Automatic sitemap generation
│   │   └── robots.ts           # robots.txt configuration
│   ├── components/
│   │   └── videos/
│   │       └── video-card.tsx  # Video card component
│   └── lib/
│       └── articles.ts         # Article data utilities
├── next.config.ts              # Next.js configuration
├── vercel.json                 # Vercel deployment config
└── package.json
```

## Data Format

Videos are stored in `data/scraped_pages.json` with the following structure:

```json
{
  "947": {
    "page_number": 947,
    "total_articles": 14,
    "scraped_articles": 14,
    "articles": {
      "1": {
        "url": "https://www.ytplatform.com/videos/...",
        "thumbnail": "https://www.ytplatform.com/wp-content/uploads/...",
        "title": "Video Title",
        "body": "Video description...",
        "video": "https://cdn.ytplatform.com/...",
        "video_width": 444,
        "video_height": 251,
        "video_duration": "5:58",
        "video_duration_seconds": 358.48,
        "video_type": "video",
        "category": ["Category Name"],
        "tags": ["tag1", "tag2", ...]
      }
    }
  }
}
```

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd /home/dhir4j/Documents/programs/video-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Update the variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://fruqvideos.com
   NEXT_PUBLIC_API_URL=https://backend.fruqvideos.com
   ```

4. **Verify your data file**

   Ensure `data/scraped_pages.json` exists and contains your video data in the correct format.

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:9002`

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://fruqvideos.com`
   - `NEXT_PUBLIC_API_URL`: `https://backend.fruqvideos.com`
6. Click "Deploy"

### Option 3: Vercel Dashboard Upload

1. Build the project locally:
   ```bash
   npm run build
   ```
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Drag and drop the `.next` folder to deploy

### Custom Domain Setup

After deployment, configure your custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add `fruqvideos.com` and `www.fruqvideos.com`
4. Update your DNS records as instructed by Vercel

## SEO Features

### Metadata

Each video page includes:
- Dynamic title and description
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD) for video objects

### Sitemap

Automatically generated at `/sitemap.xml` including:
- Homepage
- All video pages
- Category pages
- Proper priority and change frequency

### Robots.txt

Configured at `/robots.txt` to:
- Allow all search engines
- Reference sitemap
- Block admin and API routes

### Performance Optimization

- Static Site Generation (SSG) for all pages
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Standalone output for smaller deployments

## URL Structure

- Homepage: `/`
- All videos: `/videos`
- Individual video: `/videos/{slug}-{pageNumber}-{articleNumber}`
  - Example: `/videos/cooking-tutorial-make-delicious-pasta-carbonara-in-20-minutes-947-1`
- Categories: `/categories/{category}`

## API Integration

The frontend is configured to communicate with the Flask backend:

- Backend URL: `https://backend.fruqvideos.com`
- API proxy is configured in `vercel.json` for seamless integration
- All `/api/*` requests are forwarded to the backend

## Customization

### Adding More Data

1. Update `data/scraped_pages.json` with new articles
2. Rebuild the application:
   ```bash
   npm run build
   ```
3. Redeploy to Vercel

### Styling

- Tailwind configuration: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Theme configuration: `src/components/layout/theme-provider.tsx`

### Components

All components are in `src/components/`:
- Video card: `src/components/videos/video-card.tsx`
- Add new components as needed

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

2. Check TypeScript errors:
   ```bash
   npm run typecheck
   ```

### Environment Variables Not Working

Ensure environment variables start with `NEXT_PUBLIC_` for client-side access.

### Images Not Loading

Verify that image domains are added to `next.config.ts` under `images.remotePatterns`.

### Sitemap Not Generating

The sitemap is generated at build time. Make sure to rebuild after data changes:
```bash
npm run build
```

## Performance Monitoring

After deployment, monitor your site:

1. **Vercel Analytics**: Automatic performance monitoring in Vercel dashboard
2. **Google Search Console**: Submit your sitemap at `https://fruqvideos.com/sitemap.xml`
3. **PageSpeed Insights**: Test at https://pagespeed.web.dev/

## License

This project is private and proprietary.

## Support

For issues or questions:
1. Check this README
2. Review Next.js documentation: https://nextjs.org/docs
3. Review Vercel documentation: https://vercel.com/docs

## Backend Integration

The frontend connects to a Flask backend hosted at `backend.fruqvideos.com` with PostgreSQL database. Ensure:

- Backend is deployed and accessible
- CORS is configured properly
- Environment variables point to correct backend URL

---

**Built with ❤️ using Next.js and deployed on Vercel**
