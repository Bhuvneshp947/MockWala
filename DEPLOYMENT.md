# Free deployment on Cloudflare Pages (no Vercel)

This project is a TanStack Start app and is already aligned with a Cloudflare deployment target. The config in [vite.config.ts](vite.config.ts) mentions the Nitro build target using Cloudflare, which makes Cloudflare Pages the best free option for this app.

## Recommended hosting

- Platform: Cloudflare Pages
- Free domain: your-project.pages.dev
- Custom domain: free when using Cloudflare DNS
- Auto deploy: enabled by GitHub integration

## Steps

1. Push the project to GitHub.
2. Go to https://dash.cloudflare.com and open Cloudflare Pages.
3. Click Create project > Connect to Git.
4. Choose your GitHub repo.
5. Set the build settings:
   - Framework preset: None / Vite / Auto-detect
   - Build command: `npm run build`
   - Output directory: `.output/public`
6. Add environment variables in Cloudflare Pages:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. Save and deploy.
8. In the Cloudflare Pages project, click Custom domains and attach your free domain or use the generated `*.pages.dev` domain.

## Auto update on future changes

Once the repo is connected to GitHub, every push to the selected branch triggers a new Cloudflare Pages deployment automatically.

## Notes

- Cloudflare Pages is free for small projects and supports custom domains.
- The app uses Supabase, so the same environment variables must exist in the hosting dashboard.
- If Cloudflare asks for the build output folder and does not detect the app automatically, use `.output/public`.
