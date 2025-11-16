# Amenity Platform - GoDaddy Deployment Guide

## 📦 Package Contents

This deployment package contains:
- `.next/` - Production build of Next.js application
- `public/` - Static assets (images, logos, files)
- `package.json` - Dependencies configuration
- `next.config.js` - Next.js configuration
- `.htaccess` - Apache server configuration
- `server.js` - Node.js server (if applicable)

## 🚀 Deployment Steps for GoDaddy

### Option 1: Static Site Deployment (Recommended for GoDaddy Shared Hosting)

1. **Extract the ZIP file** on your computer
2. **Access GoDaddy File Manager** or use FTP client
3. **Navigate to your public_html folder** (or your domain's root directory)
4. **Delete old files** from the previous deployment
5. **Upload ALL extracted files** maintaining the folder structure
6. **Set permissions** (if needed):
   - Files: 644
   - Directories: 755

### Option 2: Node.js Deployment (for GoDaddy VPS or Node.js Hosting)

1. **Upload files** to your server via FTP or SSH
2. **Install dependencies**:
   ```bash
   npm install --production
   ```
3. **Set environment variables** (create `.env.local`):
   ```
   NODE_ENV=production
   PORT=3000
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
5. **Set up PM2** (for auto-restart):
   ```bash
   npm install -g pm2
   pm2 start server.js --name amenity-platform
   pm2 startup
   pm2 save
   ```

## 🌐 DNS Configuration

Make sure your domain DNS points to your GoDaddy hosting:
- A Record: Points to your server IP
- CNAME (www): Points to your main domain

## ✅ Post-Deployment Checklist

- [ ] Test homepage loads correctly
- [ ] Verify all navigation links work
- [ ] Check images and logos display properly
- [ ] Test responsive design on mobile
- [ ] Verify SSL certificate is active (HTTPS)
- [ ] Test all main features:
  - [ ] Feed
  - [ ] Live streaming
  - [ ] Shorts
  - [ ] Store
  - [ ] Messages
  - [ ] Creator Channels
  - [ ] SVG-YA

## 🔧 Troubleshooting

### Images Not Loading
- Check file paths are correct
- Verify public folder uploaded properly
- Clear browser cache

### 404 Errors
- Verify `.htaccess` file is in root directory
- Check rewrite rules are enabled
- Ensure all `.next` files uploaded

### Styles Not Applying
- Check CSS files in `.next/static/css/` uploaded
- Clear CDN cache if using one
- Hard refresh browser (Ctrl+F5)

### Server Errors
- Check Node.js version (>=18.0.0)
- Verify all dependencies installed
- Check error logs in GoDaddy control panel

## 📞 Support

For deployment issues:
1. Check GoDaddy documentation
2. Verify file permissions
3. Review server error logs
4. Contact GoDaddy support if needed

## 🎯 Features Included

This deployment includes:
- ✅ Complete social network interface
- ✅ Live streaming capabilities
- ✅ Video platform (Wootube)
- ✅ Marketplace integration
- ✅ Creator monetization tools
- ✅ Subscription system
- ✅ SVG-YA ministry tools
- ✅ Full responsive design
- ✅ Modern UI with gradients and animations

## 📝 Version Information

- **Version:** 3.0
- **Build Date:** November 16, 2024
- **Next.js:** 14.2.33
- **React:** 18.3.1

---

**Deployed successfully?** Visit your domain and you should see the new "Experience Reborn" homepage!
