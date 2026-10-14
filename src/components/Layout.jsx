import { Link, NavLink, Outlet } from "react-router-dom";
import { SITE_NAME } from "../config";

const nav = [
  { to: "/generator", label: "Practice Studio" },
  { to: "/library", label: "Sample Papers" },
  { to: "/geo", label: "GEO Hub" },
  { to: "/faq", label: "FAQ" },
  { to: "/login", label: "Student Sign In" },
];

export default function Layout() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-logo-tile" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </span>
            <span className="brand-name">{SITE_NAME}</span>
          </Link>
          <nav aria-label="Main">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to}>{n.label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main"><Outlet /></main>
      <footer className="site-footer">
        <p>{SITE_NAME} is free to use. Built for a GEO hackathon.</p>
        <p className="footer-links">
          <a href="/llms.txt">llms.txt</a>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/robots.txt">robots.txt</a>
        </p>
      </footer>
    </>
  );
}
