import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist." path="/404" />
      <div className="page">
        <h1>Page not found</h1>
        <p className="lede">That address does not match a page here. Try the <Link to="/library">sample paper library</Link> or the <Link to="/geo">GEO hub</Link>.</p>
      </div>
    </>
  );
}
