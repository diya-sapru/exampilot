import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { geoArticles } from "../data/geoArticles";

export default function GeoHub() {
  return (
    <>
      <Seo
        title="GEO knowledge hub"
        description="Plain-language guides to Generative Engine Optimization: how to make content that AI answer engines can find, understand and cite."
        path="/geo"
      />
      <div className="page">
        <h1>GEO knowledge hub</h1>
        <p className="lede">
          Generative Engine Optimization (GEO) is the practice of making content that AI tools can
          find, understand and cite. These guides answer the common questions, one page each.
        </p>
        <ul className="rows big">
          {geoArticles.map((a) => (
            <li key={a.slug}>
              <div>
                <Link to={`/geo/${a.slug}`}>{a.title}</Link>
                <p>{a.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
