import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_URL } from "../config";
import { papers } from "../data/papers";

export default function Library() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sample paper library",
    itemListElement: papers.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/library/${p.slug}`,
      name: p.title,
    })),
  };
  return (
    <>
      <Seo
        title="Sample paper library"
        description="Free, public sample question papers with sections, marks and timings."
        path="/library"
        jsonLd={jsonLd}
      />
      <div className="page">
        <h1>Sample paper library</h1>
        <p className="lede">
          {papers.length} free sample papers. Each page lists the sections, marks and time allowed.
        </p>
        <ul className="rows big">
          {papers.map((p) => (
            <li key={p.slug}>
              <div>
                <Link to={`/library/${p.slug}`}>{p.title}</Link>
                <p>{p.summary}</p>
              </div>
              <span>{p.marks} marks, {p.minutes} min</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
