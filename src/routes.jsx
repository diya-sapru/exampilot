import Layout from "./components/Layout";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Library from "./pages/Library";
import PaperDetail from "./pages/PaperDetail";
import GeoHub from "./pages/GeoHub";
import GeoArticle from "./pages/GeoArticle";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";
import { papers } from "./data/papers";
import { geoArticles } from "./data/geoArticles";

// getStaticPaths tells vite-react-ssg which dynamic URLs to prerender into real HTML files.
export const routes = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "generator", Component: Generator },
      { path: "library", Component: Library },
      {
        path: "library/:slug",
        Component: PaperDetail,
        getStaticPaths: () => papers.map((p) => `library/${p.slug}`),
      },
      { path: "geo", Component: GeoHub },
      {
        path: "geo/:slug",
        Component: GeoArticle,
        getStaticPaths: () => geoArticles.map((a) => `geo/${a.slug}`),
      },
      { path: "faq", Component: Faq },
      { path: "*", Component: NotFound },
    ],
  },
];
