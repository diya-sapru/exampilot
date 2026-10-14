import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { SITE_NAME } from "../config";

export default function Login() {
  const [userType, setUserType] = useState("student"); // "student" (default) or "educator"
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("alex.student@exampilot.org");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [studyLevel, setStudyLevel] = useState("College / Undergraduate");
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  function handleUserTypeChange(type) {
    setUserType(type);
    if (type === "student") {
      setEmail("alex.student@exampilot.org");
    } else {
      setEmail("sarah.miller@oakridge.edu");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const roleLabel = userType === "student" ? "Student" : "Educator";
    setStatusMessage(
      isSignUp
        ? `Account created! Welcome, ${roleLabel}. Redirecting to Practice Studio...`
        : `Welcome back, ${roleLabel}! Redirecting to Practice Studio...`
    );
    setTimeout(() => {
      navigate("/generator");
    }, 1100);
  }

  function handleDemoLogin() {
    if (userType === "student") {
      setEmail("alex.student@exampilot.org");
      setPassword("studentpractice2026");
      setStatusMessage("Student Demo Login active! Launching Practice & Mock Test Studio...");
    } else {
      setEmail("teacher.demo@exampilot.org");
      setPassword("demopassword123");
      setStatusMessage("Educator Demo Login active! Launching Studio...");
    }
    setTimeout(() => {
      navigate("/generator");
    }, 900);
  }

  return (
    <>
      <Seo
        title={userType === "student" ? "Student Practice Sign In" : "Educator Sign In"}
        description="Sign in to ExamPilot to generate syllabus mock tests, solve practice question papers, track preparation scores, and check model solutions."
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
            <span className="login-badge-pill">
              {userType === "student" ? "STUDENT PORTAL" : "EDUCATOR PORTAL"}
            </span>
          </div>

          {/* Persona / Role Selector Tabs */}
          <div className="login-role-tabs" role="tablist" aria-label="Select Account Type">
            <button
              type="button"
              role="tab"
              aria-selected={userType === "student"}
              className={`role-tab-btn ${userType === "student" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("student")}
            >
              🎓 Student (Exam Practice)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={userType === "educator"}
              className={`role-tab-btn ${userType === "educator" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("educator")}
            >
              👨‍🏫 Educator
            </button>
          </div>

          <h1 className="login-title">
            {userType === "student"
              ? isSignUp
                ? "Create Student Practice Account"
                : "Student Exam Practice Sign In"
              : isSignUp
                ? "Create Educator Account"
                : "Educator Sign In"}
          </h1>
          <p className="login-subtext">
            {userType === "student"
              ? isSignUp
                ? "Join thousands of students generating syllabus mock tests, solving questions, and preparing for exams."
                : "Access your generated practice tests, solve mock question papers, and check answers with detailed rubrics."
              : isSignUp
                ? "Build curriculum blueprints and export examination sheets."
                : "Access your saved papers and evaluation rubrics."}
          </p>

          {statusMessage && (
            <div className="login-status-alert" role="status">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-field-group">
                <label htmlFor="login-level">
                  {userType === "student" ? "Academic Level / Target Exam" : "Teaching Department"}
                </label>
                <select
                  id="login-level"
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value)}
                >
                  {userType === "student" ? (
                    <>
                      <option value="College / Undergraduate">College / Undergraduate (B.Tech, B.Sc, BCA)</option>
                      <option value="Grade 12 / High School">Grade 12 / High School (Senior Secondary)</option>
                      <option value="Grade 10 / Secondary">Grade 10 / Secondary Board</option>
                      <option value="Competitive Exam (GATE / JEE / GRE)">Competitive Exam (GATE, JEE, GRE, etc.)</option>
                      <option value="Postgraduate / Master's">Postgraduate / Master&apos;s</option>
                    </>
                  ) : (
                    <>
                      <option value="Computer Science / IT">Computer Science / IT</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics / Chemistry">Physics / Chemistry</option>
                      <option value="Humanities & Languages">Humanities & Languages</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div className="login-field-group">
              <label htmlFor="login-email">
                {userType === "student" ? "Student Email or Username" : "Academic Email"}
              </label>
              <input
                id="login-email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={userType === "student" ? "alex.student@university.edu" : "name@school.edu"}
              />
            </div>

            <div className="login-field-group">
              <div className="login-password-label-row">
                <label htmlFor="login-password">Password</label>
                {!isSignUp && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent to your registered email.");
                    }}
                    className="forgot-link"
                  >
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
              {isSignUp
                ? userType === "student"
                  ? "Create Free Student Account"
                  : "Create Educator Account"
                : userType === "student"
                  ? "Sign In to Practice Studio"
                  : "Sign In as Educator"}
            </button>

            <button
              type="button"
              className="btn btn-secondary login-demo-btn"
              onClick={handleDemoLogin}
              title="One-click demo access"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              {userType === "student"
                ? "Quick Demo Login (Student Practice Access)"
                : "Quick Demo Login (Educator Access)"}
            </button>
          </form>

          <div className="login-footer-switch">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button type="button" className="text-button" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New student preparing for exams?{" "}
                <button type="button" className="text-button" onClick={() => setIsSignUp(true)}>
                  Create free practice account
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
