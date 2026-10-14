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
        title={`${SITE_NAME} - Student Practice & Question Paper Generator`}
        description="Paste your syllabus topics and instantly generate mock exam papers with MCQs, mark distributions, and complete answer keys to solve and practice for exams."
        path="/"
        jsonLd={jsonLd}
      />

      <section className="hero">
        <div className="hero-copy">
          <h1>Paste your syllabus. Generate mock papers to solve &amp; practice.</h1>
          <p className="lede">
            {SITE_NAME} is a free exam preparation studio for students. Turn your syllabus
            topics into balanced mock tests with MCQs, short answers, and instant answer keys
            to self-evaluate and score higher in your exams.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/generator">Start Practice Test</Link>
            <Link className="btn" to="/library">Browse Sample Papers</Link>
          </div>
        </div>

        <div className="sheet" aria-label="Example of a generated practice paper">
          <div className="sheet-head">
            <strong>Data Structures: Practice Paper</strong>
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
        <h2>How does ExamPilot help you prepare?</h2>
        <ol className="steps">
          <li><strong>Paste your syllabus topics.</strong> Enter chapters or concepts you need to revise for your exam.</li>
          <li><strong>Pick your marks &amp; format.</strong> Select 20 to 100 marks with realistic MCQ and descriptive balance.</li>
          <li><strong>Solve &amp; self-evaluate.</strong> Practice questions interactively, verify answers with model solutions, or print.</li>
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
