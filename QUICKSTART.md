# Quick Start Guide - FruqVideos

Get your video platform up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://fruqvideos.com
NEXT_PUBLIC_API_URL=https://backend.fruqvideos.com
```

## 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:9002

## 4. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

That's it! Your site is live! 🚀

## Key URLs

- **Homepage**: `/`
- **All Videos**: `/videos`
- **Single Video**: `/videos/[slug]`
- **Sitemap**: `/sitemap.xml`
- **Robots**: `/robots.txt`

## Next Steps

1. Add your custom domain in Vercel Dashboard
2. Submit sitemap to Google Search Console
3. Monitor analytics in Vercel Dashboard

## Need Help?

- **Full Documentation**: See [README.md](README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Next.js Docs**: https://nextjs.org/docs

---

**Happy coding!** 🎉
