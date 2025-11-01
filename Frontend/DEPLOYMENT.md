# Vercel Deployment Guide for AgriVest Frontend

## Quick Deployment Steps

### Option 1: Deploy from Frontend Directory (Recommended)

If deploying directly from the `Frontend/` directory:

1. **Configure Vercel Project Settings:**
   - Root Directory: `Frontend`
   - Framework Preset: `Next.js`
   - Build Command: `pnpm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

2. **Use the provided `vercel.json`** in the `Frontend/` directory

### Option 2: Deploy from Monorepo Root

If deploying from the root `AgriVest/` directory:

1. **Configure Vercel Project Settings:**
   - Root Directory: `.` (or leave default)
   - Framework Preset: `Next.js`
   - Build Command: `cd Frontend && pnpm run build`
   - Output Directory: `Frontend/.next`
   - Install Command: `cd Frontend && pnpm install`

2. **Use the provided `vercel.json`** in the root directory

## Troubleshooting 404 Errors

### Common Issues and Solutions:

1. **Wrong Root Directory**
   - ✅ Ensure Vercel project settings point to `Frontend` as root directory
   - ✅ Or use the monorepo configuration with proper paths

2. **Build Output Location**
   - The build creates a standalone output
   - Make sure Output Directory matches the build location

3. **Package Manager Mismatch**
   - This project uses `pnpm` not `npm`
   - Remove `package-lock.json` if it exists (already done)
   - Ensure Vercel uses pnpm: Set in project settings or via `vercel.json`

4. **Static vs Dynamic Routes**
   - All current routes are static (○ symbol in build output)
   - They should work without issues once root directory is correct

## Vercel CLI Deployment (Alternative)

```bash
cd Frontend
pnpm install -g vercel
vercel --prod
```

Follow the prompts and ensure:
- Framework: Next.js
- Root directory: `./` (since you're already in Frontend)

## Verification Checklist

After deployment, verify these routes work:
- ✅ `/` - Homepage
- ✅ `/about` - About page
- ✅ `/farms` - Farms listing
- ✅ `/marketplace` - Marketplace
- ✅ `/farmer-dashboard` - Farmer dashboard
- ✅ `/live-blockchain-explorer` - Blockchain explorer

## Environment Variables (Future)

When you add backend API integration:

```env
NEXT_PUBLIC_API_URL=https://your-django-backend.com
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_PLATFORM_CONTRACT=0xA55C1617bDe31d17743434D19cf44D8cFe0E2FB4
NEXT_PUBLIC_REWARDS_CONTRACT=0x31052F57De0d0498FE18E34733b6B54f0038f2e3
```

Add these in Vercel Project Settings → Environment Variables
