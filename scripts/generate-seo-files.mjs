// Runs before every build: writes sitemap.xml and llms.txt from the site's data,
// so they never go out of date when you add papers or articles.
import { writeFileSync, mkdirSync } from "node:fs";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "../src/config.js";
import { papers } from "../src/data/papers.js";
import { geoArticles } from "../src/data/geoArticles.js";

mkdirSync("public", { recursive: true });
const today = new Date().toISOString().slice(0, 10);

const paths = [
  "/", "/generator", "/library", "/geo", "/faq",
  ...papers.map((p) => `/library/${p.slug}`),
  ...geoArticles.map((a) => `/geo/${a.slug}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync("public/sitemap.xml", sitemap);

const llms = `# ${SITE_NAME}

> ${SITE_TAGLINE} Free sample papers and a knowledge hub on Generative Engine Optimization (GEO).

## Key pages
- [Sample paper generator](${SITE_URL}/generator): paste syllabus topics, get a structured question paper.
- [Sample paper library](${SITE_URL}/library): free, public sample papers with marks and sections.
- [GEO knowledge hub](${SITE_URL}/geo): plain-language guides to Generative Engine Optimization.
- [FAQ](${SITE_URL}/faq): common questions about the site.

## Sample papers
${papers.map((p) => `- [${p.title}](${SITE_URL}/library/${p.slug}): ${p.summary}`).join("\n")}

## GEO guides
${geoArticles.map((a) => `- [${a.title}](${SITE_URL}/geo/${a.slug}): ${a.description}`).join("\n")}
`;
writeFileSync("public/llms.txt", llms);
console.log("Generated public/sitemap.xml and public/llms.txt");
