import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_URL, SITE_NAME } from "../config";
import { geoArticles } from "../data/geoArticles";
import NotFound from "./NotFound";

export default function GeoArticle() {
  const { slug } = useParams();
  const a = geoArticles.find((x) => x.slug === slug);
  if (!a) return <NotFound />;

  const path = `/geo/${a.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      dateModified: a.updated,
      datePublished: a.updated,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
      mainEntityOfPage: `${SITE_URL}${path}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.sections.map((s) => ({
        "@type": "Question",
        name: s.heading,
        acceptedAnswer: { "@type": "Answer", text: s.body },
      })),
    },
  ];

  return (
    <>
      <Seo title={a.title} description={a.description} path={path} jsonLd={jsonLd} />
      <div className="page prose">
        <p className="crumbs"><Link to="/geo">GEO hub</Link></p>
        <h1>{a.title}</h1>
        <p className="answer">{a.answer}</p>
        <p className="byline">By {SITE_NAME} team. Updated <time dateTime={a.updated}>{a.updated}</time>.</p>
        {a.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
