import Seo from "../components/Seo";
import { faqs } from "../data/geoArticles";

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <Seo
        title="Frequently asked questions"
        description="Answers to common questions about ExamPilot and Generative Engine Optimization."
        path="/faq"
        jsonLd={jsonLd}
      />
      <div className="page prose">
        <h1>Frequently asked questions</h1>
        {faqs.map((f) => (
          <section key={f.q}>
            <h2>{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}
      </div>
    </>
  );
}
