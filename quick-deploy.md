# 🚀 Quick Deployment Fix

## Common Issues & Solutions

### Issue 1: ESLint Errors
```bash
# Skip linting for quick deploy
npm run build
```

### Issue 2: Import/Export Errors
- Fixed import paths in App.jsx
- Updated package.json scripts

### Issue 3: Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key
```

## Quick Deploy Steps

### Option 1: Vercel (Fastest)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build locally first
npm run build

# 3. Deploy
vercel --prod
```

### Option 2: Netlify Drop
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag & drop the `dist` folder

### Option 3: GitHub Pages
```bash
# 1. Install gh-pages
npm i -D gh-pages

# 2. Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# 3. Deploy
npm run deploy
```

## Emergency Fixes

### Fix 1: Remove Problematic Imports
If imports fail, temporarily comment out:
- Quest SDK imports
- Complex analytics

### Fix 2: Simple Build
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Fix 3: Static Deployment
Use the built `dist` folder on any static host:
- Surge.sh
- Firebase Hosting
- AWS S3

## Test Locally First
```bash
npm run build
npm run preview
```

## 🎯 Status Check
- [ ] Build completes without errors
- [ ] Preview works locally
- [ ] All routes accessible
- [ ] No console errors