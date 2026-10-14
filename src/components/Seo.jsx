import { Head } from "vite-react-ssg";
import { SITE_URL, SITE_NAME } from "../config";

// One component handles title, description, canonical, Open Graph and JSON-LD.
// vite-react-ssg renders this into the static HTML, so crawlers that don't run JS still see it.
export default function Seo({ title, description, path = "/", jsonLd }) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Head>
  );
}
