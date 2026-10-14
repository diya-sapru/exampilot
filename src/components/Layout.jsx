import { Link, NavLink, Outlet } from "react-router-dom";
import { SITE_NAME } from "../config";
import { AuthProvider, useAuth } from "../context/AuthContext";

function HeaderNav() {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <nav aria-label="Main" className="nav-menu">
      <NavLink to="/generator">Practice Studio</NavLink>
      <NavLink to="/library">Sample Papers</NavLink>
      <NavLink to="/geo">GEO Hub</NavLink>
      <NavLink to="/faq">FAQ</NavLink>

      {isLoggedIn ? (
        <div className="nav-user-badge">
          <span className="user-avatar-tag" title={user.email}>
            🎓 {user.name || "Student"}
          </span>
          <button
            type="button"
            className="nav-signout-btn"
            onClick={logout}
            title="Sign out of student account"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <NavLink to="/login" className="nav-signin-link">
          Student Sign In
        </NavLink>
      )}
    </nav>
  );
}

function LayoutContent() {
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
          <HeaderNav />
        </div>
      </header>
      <main id="main"><Outlet /></main>
      <footer className="site-footer">
        <p>{SITE_NAME} is free to use. Built for students preparing for exams.</p>
        <p className="footer-links">
          <a href="/llms.txt">llms.txt</a>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/robots.txt">robots.txt</a>
        </p>
      </footer>
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
