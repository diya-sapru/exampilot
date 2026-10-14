import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "../config";
import { papers } from "../data/papers";
import { geoArticles } from "../data/geoArticles";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title={SITE_NAME}
        description="Paste your syllabus topics and get a structured sample question paper. Free papers and a guide to Generative Engine Optimization (GEO)."
        path="/"
        jsonLd={jsonLd}
      />

      <section className="hero">
        <div className="hero-copy">
          <h1>Paste a syllabus. Get an exam paper.</h1>
          <p className="lede">
            {SITE_NAME} is a free tool that turns a list of syllabus topics into a
            sectioned sample question paper with marks, ready to print.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/generator">Generate a paper</Link>
            <Link className="btn" to="/library">Browse sample papers</Link>
          </div>
        </div>

        <div className="sheet" aria-label="Example of a generated paper">
          <div className="sheet-head">
            <strong>Data Structures: Sample Paper</strong>
            <span>60 marks, 2 hours</span>
          </div>
          <p className="sheet-note">From topics: Stacks, Queues, Binary trees</p>
          <ol className="sheet-q">
            <li><span className="mk">1</span>Which data structure follows First In, First Out?</li>
            <li><span className="mk">4</span>Differentiate between a linear queue and a circular queue.</li>
            <li><span className="mk">10</span>Explain insertion and deletion in a binary search tree with an example.</li>
          </ol>
        </div>
      </section>

      <section className="band">
        <h2>How does ExamPilot work?</h2>
        <ol className="steps">
          <li><strong>Paste your topics.</strong> One topic per line from your syllabus.</li>
          <li><strong>Choose the paper size.</strong> Pick a title and difficulty.</li>
          <li><strong>Print or save.</strong> Get sections A, B and C with marks.</li>
        </ol>
      </section>

      <section className="band">
        <div className="band-head">
          <h2>Free sample papers</h2>
          <Link to="/library">See all papers</Link>
        </div>
        <ul className="rows">
          {papers.map((p) => (
            <li key={p.slug}>
              <Link to={`/library/${p.slug}`}>{p.title}</Link>
              <span>{p.marks} marks</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="band">
        <div className="band-head">
          <h2>Learn Generative Engine Optimization</h2>
          <Link to="/geo">Open the GEO hub</Link>
        </div>
        <ul className="rows">
          {geoArticles.map((a) => (
            <li key={a.slug}>
              <Link to={`/geo/${a.slug}`}>{a.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
