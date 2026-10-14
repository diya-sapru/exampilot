import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_NAME } from "../config";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("sarah.miller@oakridge.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState("Educator / Teacher");
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setStatusMessage(isSignUp ? "Account created successfully! Redirecting..." : "Welcome back, Educator! Redirecting to Generator...");
    setTimeout(() => {
      navigate("/generator");
    }, 1200);
  }

  function handleDemoLogin() {
    setEmail("teacher.demo@exampilot.org");
    setPassword("demopassword123");
    setStatusMessage("Quick Demo Login active! Launching Exam Studio...");
    setTimeout(() => {
      navigate("/generator");
    }, 900);
  }

  return (
    <>
      <Seo
        title="Teacher & Educator Sign In"
        description="Sign in to ExamPilot to manage question banks, syllabus blueprints, and export print-ready examination papers."
        path="/login"
      />

      <div className="login-screen-container">
        <div className="login-card-panel">
          <div className="login-card-header">
            <Link to="/" className="login-brand" title="Back to ExamPilot Home">
              <span className="brand-logo-tile" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </span>
              <span className="login-brand-name">{SITE_NAME}</span>
            </Link>
            <span className="login-badge-pill">TEACHER PORTAL</span>
          </div>

          <h1 className="login-title">
            {isSignUp ? "Create Educator Account" : "Educator Workspace Sign In"}
          </h1>
          <p className="login-subtext">
            {isSignUp
              ? "Join educators building syllabus blueprints and custom examination sheets."
              : "Access your saved drafts, customized question banks, and evaluation rubrics."}
          </p>

          {statusMessage && (
            <div className="login-status-alert" role="status">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-field-group">
                <label htmlFor="login-role">Teaching Role / Subject</label>
                <select
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Computer Science / IT">Computer Science / IT</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics / Chemistry">Physics / Chemistry</option>
                  <option value="Humanities & Languages">Humanities & Languages</option>
                  <option value="School Department Head">School Department Head</option>
                </select>
              </div>
            )}

            <div className="login-field-group">
              <label htmlFor="login-email">Academic Email</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
              />
            </div>

            <div className="login-field-group">
              <div className="login-password-label-row">
                <label htmlFor="login-password">Password</label>
                {!isSignUp && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your academic email."); }} className="forgot-link">
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="login-options-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            <button type="submit" className="btn btn-navy login-submit-btn">
              {isSignUp ? "Create Account & Start" : "Sign In to Studio"}
            </button>

            <button
              type="button"
              className="btn btn-secondary login-demo-btn"
              onClick={handleDemoLogin}
              title="One-click demo sign in"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Quick Demo Login (Teacher Access)
            </button>
          </form>

          <div className="login-footer-switch">
            {isSignUp ? (
              <p>
                Already have an educator account?{" "}
                <button type="button" className="text-button" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to ExamPilot?{" "}
                <button type="button" className="text-button" onClick={() => setIsSignUp(true)}>
                  Create free account
                </button>
              </p>
            )}
            <div className="login-back-home">
              <Link to="/">&larr; Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
