# Setup (5 minutes)

1. Copy these into your repo, replacing what is there:
   `src/`, `public/`, `scripts/`, `index.html`, `vite.config.js`
2. Delete the old `src/App.jsx`, `src/App.css`, `src/assets/` (unused now).
3. Install the two new packages:
   `npm i react-router-dom vite-react-ssg`
4. In `package.json` change the build script to:
   `"build": "node scripts/generate-seo-files.mjs && vite-react-ssg build"`
5. Set your real deployed URL in `src/config.js` (SITE_URL) and in `public/robots.txt` (Sitemap line).
6. Run `npm run dev` to work, `npm run build` to produce prerendered pages in `dist/`.

Add a paper: add an object to `src/data/papers.js`. Add a GEO article: add one to `src/data/geoArticles.js`.
The page, its URL, sitemap.xml and llms.txt are all created automatically on build.
