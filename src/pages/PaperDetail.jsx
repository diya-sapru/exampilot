import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_URL, SITE_NAME } from "../config";
import { papers } from "../data/papers";
import NotFound from "./NotFound";

export default function PaperDetail() {
  const { slug } = useParams();
  const p = papers.find((x) => x.slug === slug);
  if (!p) return <NotFound />;

  const path = `/library/${p.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: p.title,
      description: p.summary,
      educationalLevel: p.level,
      learningResourceType: "Sample question paper",
      teaches: p.topics,
      timeRequired: `PT${p.minutes}M`,
      isAccessibleForFree: true,
      url: `${SITE_URL}${path}`,
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Library", item: `${SITE_URL}/library` },
        { "@type": "ListItem", position: 2, name: p.title, item: `${SITE_URL}${path}` },
      ],
    },
  ];

  return (
    <>
      <Seo title={p.title} description={p.summary} path={path} jsonLd={jsonLd} />
      <div className="page">
        <p className="crumbs no-print"><Link to="/library">Library</Link> / {p.subject}</p>
        <h1>{p.title}</h1>
        <p className="lede">{p.summary}</p>
        <dl className="facts">
          <div><dt>Level</dt><dd>{p.level}</dd></div>
          <div><dt>Total marks</dt><dd>{p.marks}</dd></div>
          <div><dt>Time allowed</dt><dd>{p.minutes} minutes</dd></div>
          <div><dt>Topics covered</dt><dd>{p.topics.join(", ")}</dd></div>
        </dl>
        <article className="paper">
          {p.sections.map((s) => (
            <section key={s.name}>
              <h2>{s.name} ({s.marks})</h2>
              <ol>
                {s.questions.map((q, i) => <li key={i}><span>{q}</span></li>)}
              </ol>
            </section>
          ))}
        </article>
        <button className="btn no-print" onClick={() => window.print()}>Print this paper</button>
      </div>
    </>
  );
}
