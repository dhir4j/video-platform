# Deployment Guide - FruqVideos

This guide provides step-by-step instructions for deploying the FruqVideos platform to Vercel.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to Git
- [ ] `data/scraped_pages.json` contains your video data
- [ ] Environment variables are configured
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No TypeScript errors (`npm run typecheck`)

## Quick Deploy (5 Minutes)

### Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate.

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL production
   # Enter: https://fruqvideos.com

   vercel env add NEXT_PUBLIC_API_URL production
   # Enter: https://backend.fruqvideos.com
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

Your site will be live at the Vercel-provided URL!

## GitHub Integration (Recommended for CI/CD)

### Initial Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SITE_URL` | `https://fruqvideos.com` |
   | `NEXT_PUBLIC_API_URL` | `https://backend.fruqvideos.com` |

5. **Deploy**
   Click "Deploy" and wait for build to complete (2-3 minutes)

### Automatic Deployments

After initial setup:
- Every push to `main` branch triggers a production deployment
- Pull requests get preview deployments automatically
- View deployment status in Vercel dashboard

## Custom Domain Setup

### Add Domain to Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Click "Add Domain"
4. Enter `fruqvideos.com`
5. Click "Add"

### Configure DNS

Vercel will provide DNS configuration. Add these records to your DNS provider:

**For Root Domain (fruqvideos.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Verification:**
Wait 5-10 minutes, then check:
```bash
dig fruqvideos.com
dig www.fruqvideos.com
```

### SSL Certificate

Vercel automatically provisions SSL certificates:
- Typically ready in 1-2 minutes
- Auto-renews before expiration
- Supports HTTP/2 and HTTP/3

## Post-Deployment

### 1. Verify Deployment

Check these URLs:
- [ ] Homepage: `https://fruqvideos.com`
- [ ] Videos listing: `https://fruqvideos.com/videos`
- [ ] Individual video: `https://fruqvideos.com/videos/[any-video-slug]`
- [ ] Sitemap: `https://fruqvideos.com/sitemap.xml`
- [ ] Robots: `https://fruqvideos.com/robots.txt`

### 2. Test Functionality

- [ ] Video playback works
- [ ] Navigation between pages
- [ ] Category filtering
- [ ] Related videos display
- [ ] Dark/light mode toggle
- [ ] Mobile responsiveness

### 3. SEO Setup

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add property for `https://fruqvideos.com`
3. Verify ownership (Vercel makes this easy)
4. Submit sitemap: `https://fruqvideos.com/sitemap.xml`

**Google Analytics (Optional):**
1. Create GA4 property
2. Add tracking ID to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Redeploy

### 4. Performance Testing

Run these tests:
- [ ] Google PageSpeed Insights: https://pagespeed.web.dev/
- [ ] GTmetrix: https://gtmetrix.com/
- [ ] WebPageTest: https://www.webpagetest.org/

Target scores:
- PageSpeed: 90+ (both mobile and desktop)
- Core Web Vitals: All green

## Updating Content

### Adding New Videos

1. **Update Data File**
   ```bash
   # Edit data/scraped_pages.json with new videos
   ```

2. **Test Locally**
   ```bash
   npm run build
   npm start
   ```

3. **Deploy Changes**

   **Option A - Git Push (if using GitHub integration):**
   ```bash
   git add data/scraped_pages.json
   git commit -m "Add new videos"
   git push origin main
   ```

   **Option B - Vercel CLI:**
   ```bash
   vercel --prod
   ```

### Vercel automatically:
- Rebuilds the site
- Regenerates sitemap
- Updates all static pages
- Deploys in 2-3 minutes

## Monitoring & Analytics

### Vercel Analytics

Built-in analytics available at:
- Dashboard → Your Project → Analytics
- Tracks:
  - Page views
  - Unique visitors
  - Top pages
  - Performance metrics

### Runtime Logs

View deployment logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Select "Deployments"
4. Click on any deployment
5. View "Build Logs" and "Function Logs"

### Performance Monitoring

Enable Vercel Speed Insights:
1. Dashboard → Your Project → Speed Insights
2. Click "Enable"
3. View real user performance data

## Rollback Procedures

### Instant Rollback

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" menu → "Promote to Production"
4. Confirm

Changes are live in seconds!

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

## Troubleshooting

### Build Failures

**Clear Cache and Retry:**
```bash
vercel --prod --force
```

**Check Build Logs:**
1. Vercel Dashboard → Deployments → Failed deployment
2. Review "Build Logs" tab
3. Fix errors and redeploy

### Environment Variables Not Applied

Redeploy after adding env vars:
```bash
vercel --prod --force
```

### Domain Not Working

1. Verify DNS propagation:
   ```bash
   dig fruqvideos.com
   ```

2. Check Vercel domain settings
3. Wait up to 24 hours for full propagation

### Sitemap Not Updating

Sitemap is generated at build time:
```bash
# Force rebuild
vercel --prod --force
```

## CI/CD Best Practices

### Branch Strategy

```
main (production)
  ↑
develop (preview)
  ↑
feature/* (preview per PR)
```

### Preview Deployments

Every PR gets a preview URL:
- Automatic deployment
- Unique URL per PR
- Perfect for testing before merge

### Environment-Specific Config

```bash
# Production
vercel env add NEXT_PUBLIC_SITE_URL production

# Preview
vercel env add NEXT_PUBLIC_SITE_URL preview

# Development
vercel env add NEXT_PUBLIC_SITE_URL development
```

## Cost Optimization

### Vercel Free Tier Includes:
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Preview deployments

### If You Need More:
- **Pro Plan**: $20/month
  - 1TB bandwidth
  - Advanced analytics
  - Priority support

### Reduce Bandwidth Usage:
1. Use image optimization (already configured)
2. Enable Vercel Image Optimization
3. Implement proper caching headers

## Support

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com (Pro plan)

**Project Issues:**
- Check build logs first
- Review this documentation
- Test locally before deploying

## Security Checklist

Post-deployment security:

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers configured (in vercel.json)
- [ ] Environment variables secured (never in code)
- [ ] API routes protected (if applicable)
- [ ] CORS configured on backend
- [ ] No sensitive data in client-side code

## Maintenance Schedule

**Weekly:**
- Review analytics
- Check performance metrics
- Monitor error logs

**Monthly:**
- Update dependencies: `npm update`
- Review and optimize bundle size
- Test all critical user flows

**Quarterly:**
- Major dependency updates
- Performance audit
- Security review

---

**Deployment successful! Your site is now live at https://fruqvideos.com** 🎉
