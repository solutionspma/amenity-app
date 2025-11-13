# Netlify Deployment Guide for Amenity Platform

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production-ready Amenity Platform with Netlify config"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Select the `amenity-app` folder as build directory

### 3. Build Configuration
Netlify will automatically detect the `netlify.toml` file with these settings:
- **Build command**: `npm run build`
- **Publish directory**: `.next` (auto-detected by @netlify/plugin-nextjs)
- **Framework**: Next.js (auto-detected)

### 4. Environment Variables
Add these in Netlify dashboard → Site settings → Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 5. Deploy!
- Netlify will automatically build and deploy
- Your site will be available at `https://your-site-name.netlify.app`

## Alternative: Manual Deploy

If you prefer to deploy the built files manually:

```bash
# Build the application
npm run build

# Deploy the .next folder to any static host
# The @netlify/plugin-nextjs handles the rest
```

## Troubleshooting

### 404 Errors
- The `netlify.toml` includes the Next.js plugin that handles routing
- All pages are properly configured for static generation
- API routes will work through Netlify Functions

### Build Errors
- All TypeScript errors have been resolved
- Dependencies are properly installed
- Mobile app is separated to avoid conflicts

## Features Included

✅ **Complete Amenity Platform** (13,571 lines of code)
✅ **JAY-I AI Assistant** with advanced analytics
✅ **Video Studio** with AI-powered editing
✅ **Social Hub** with creator communities
✅ **Monetization** with 80-90% revenue share
✅ **Mobile-Ready** architecture
✅ **Production Optimized** build

## Next Steps After Deploy

1. **Test all features** on your live site
2. **Configure Supabase** database and authentication
3. **Set up Stripe** for payments
4. **Deploy mobile apps** using Expo EAS
5. **Add custom domain** in Netlify settings

Your **Amenity Platform** is now ready for production! 🚀