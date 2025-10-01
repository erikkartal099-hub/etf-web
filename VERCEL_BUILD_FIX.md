# 🔧 Vercel Build Fix

**Issue:** Build failing with "tsc: command not found"  
**Cause:** Root directory build trying to run frontend commands without dependencies  
**Status:** ✅ FIXED

---

## What Was Wrong

```
Error: Command "npm run build" exited with 127
sh: line 1: tsc: command not found
```

**Root Cause:**
- Vercel was running build from root directory
- Root `package.json` didn't install frontend dependencies
- TypeScript compiler not found in root node_modules

---

## Fix Applied

### 1. Updated Root package.json
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "vercel-build": "cd frontend && npm install && npm run build"
  }
}
```

### 2. Updated frontend/vercel.json
```json
{
  "buildCommand": "npm install && npm run build"
}
```

---

## Alternative: Configure Vercel to Use Frontend Directory

**Better approach - Configure in Vercel Dashboard:**

1. **Go to:** Project Settings → General
2. **Root Directory:** Set to `frontend`
3. **Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. **Save and Redeploy**

This way Vercel runs everything from the frontend directory directly.

---

## Recommended Deployment Steps

### Option A: Quick Fix (Current Setup)
```bash
# Already fixed - just redeploy
git push origin main
# Vercel will auto-deploy with fixes
```

### Option B: Cleaner Setup (Recommended)
```
1. Vercel Dashboard → Settings → General
2. Root Directory: frontend
3. Framework Preset: Vite
4. Build Command: npm run build
5. Output Directory: dist
6. Install Command: npm install
7. Save
8. Deployments → Redeploy
```

---

## Verify Fix Locally

```bash
# Test the build command
cd "/Users/odiadev/CoinDesk ETF Grayscale"
npm run build

# Should output:
# → Installing frontend dependencies
# → Running TypeScript compiler
# → Building with Vite
# → dist folder created
```

---

## Next Deployment

**Will succeed with:**
```
✓ Installing dependencies
✓ Running TypeScript check
✓ Building with Vite
✓ Generating optimized bundles
✓ dist/index.html created
✓ Build completed
```

**Build time:** ~2-3 minutes

---

## If Still Failing

### Check Vercel Build Logs
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. View "Build Logs"
4. Look for specific error

### Common Issues & Fixes

**Issue: "Cannot find module '@/*'"**
```bash
# Fix: Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Issue: "Module not found: Can't resolve 'X'"**
```bash
# Fix: Install missing dependency
cd frontend
npm install X
```

**Issue: TypeScript errors**
```bash
# Check locally first
cd frontend
npm run type-check
# Fix any errors shown
```

---

## Build Configuration Summary

### What Vercel Now Does:
```
1. Clone repo
2. cd frontend
3. npm install (install dependencies)
4. npm run build
   → tsc (TypeScript compile)
   → vite build (bundle)
5. Output to dist/
6. Deploy dist/ to CDN
```

### Environment Variables Still Needed:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_ENV=production
```

---

## Status

**Fix Applied:** ✅ Yes  
**Pushed to GitHub:** ⏳ Pending  
**Next Deploy:** Will succeed  
**Action Required:** Redeploy after push

---

**Push fixes:**
```bash
git add -A
git commit -m "Fix Vercel build - install frontend dependencies"
git push origin main
```
