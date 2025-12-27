# Cloudflare Pages Deployment Guide

## Option 1: Using Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard** → Pages → Create a project
2. **Connect to Git**: Select your GitHub repository `ahmetcotur/lenktr`
3. **Build Settings**:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

4. **Environment Variables**:
   - Add `VITE_SUPABASE_URL` = `https://dlxgesmnpjavjvabxwrb.supabase.co`
   - Add `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. **Save and Deploy**

## Option 2: Using Wrangler CLI (Alternative)

If you want to use CLI, change the deploy command in Cloudflare Pages settings:

**Build command**: `npm run build`
**Deploy command**: `npx wrangler pages deploy dist --project-name=lenk-tr`

## Current Issue

The error occurs because Cloudflare is trying to run `npx wrangler deploy` (for Workers) instead of `npx wrangler pages deploy` (for Pages).

**Solution**: Use Cloudflare Dashboard to set up the project instead of using the deploy command.

## After Deployment

Your site will be available at:
- `https://lenk-tr.pages.dev`
- Or your custom domain if configured

## Redirects

The `public/_redirects` file will handle SPA routing automatically on Cloudflare Pages.
