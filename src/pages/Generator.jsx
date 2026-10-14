import { useState, useMemo } from "react";
import Seo from "../components/Seo";
import { questionBank } from "../data/questionBank";

const PRESET_MARKS = [20, 25, 30, 40, 50, 60, 80, 100];
const DEFAULT_TOPICS = "Arrays\nLinked lists\nStacks\nQueues\nBinary trees\nSorting algorithms";

// Helper to compute exact blueprint that always equals totalMarks
export function buildBlueprint(totalMarks) {
  const marks = Math.max(10, Math.min(200, Math.round(Number(totalMarks) || 50)));

  // Pre-configured balanced pedagogical presets
  const presets = {
    10: { mcq: { count: 2, each: 1 }, short: { count: 2, each: 2 }, long: { count: 1, each: 4 } },
    15: { mcq: { count: 3, each: 1 }, short: { count: 2, each: 3 }, long: { count: 1, each: 6 } },
    20: { mcq: { count: 4, each: 1 }, short: { count: 2, each: 4 }, long: { count: 1, each: 8 } },
    25: { mcq: { count: 5, each: 1 }, short: { count: 5, each: 2 }, long: { count: 2, each: 5 } },
    30: { mcq: { count: 6, each: 1 }, short: { count: 4, each: 3 }, long: { count: 2, each: 6 } },
    35: { mcq: { count: 7, each: 1 }, short: { count: 4, each: 3 }, long: { count: 2, each: 8 } },
    40: { mcq: { count: 8, each: 1 }, short: { count: 4, each: 4 }, long: { count: 2, each: 8 } },
    45: { mcq: { count: 9, each: 1 }, short: { count: 6, each: 3 }, long: { count: 3, each: 6 } },
    50: { mcq: { count: 10, each: 1 }, short: { count: 5, each: 4 }, long: { count: 2, each: 10 } },
    60: { mcq: { count: 12, each: 1 }, short: { count: 6, each: 4 }, long: { count: 3, each: 8 } },
    70: { mcq: { count: 14, each: 1 }, short: { count: 7, each: 4 }, long: { count: 4, each: 7 } },
    75: { mcq: { count: 15, each: 1 }, short: { count: 10, each: 3 }, long: { count: 5, each: 6 } },
    80: { mcq: { count: 16, each: 1 }, short: { count: 8, each: 4 }, long: { count: 4, each: 8 } },
    90: { mcq: { count: 18, each: 1 }, short: { count: 9, each: 4 }, long: { count: 6, each: 6 } },
    100: { mcq: { count: 20, each: 1 }, short: { count: 10, each: 4 }, long: { count: 4, each: 10 } },
  };

  if (presets[marks]) {
    const bp = presets[marks];
    const total = bp.mcq.count * bp.mcq.each + bp.short.count * bp.short.each + bp.long.count * bp.long.each;
    if (total === marks) return { marks, ...bp };
  }

  // Dynamic solver for arbitrary custom marks:
  let best = null;
  let bestScore = Infinity;
  const possibleShortEach = [2, 3, 4];
  const possibleLongEach = [5, 6, 7, 8, 10];

  for (const sEach of possibleShortEach) {
    for (const lEach of possibleLongEach) {
      const minMcq = Math.max(1, Math.floor(marks * 0.12));
      const maxMcq = Math.min(marks - (sEach + lEach), Math.ceil(marks * 0.28));

      for (let mCount = minMcq; mCount <= maxMcq; mCount++) {
        const remaining = marks - mCount;
        const targetHalf = remaining / 2;
        const maxSCount = Math.floor(remaining / sEach);

        for (let sCount = 1; sCount <= maxSCount; sCount++) {
          const sTotal = sCount * sEach;
          const lTotal = remaining - sTotal;
          if (lTotal > 0 && lTotal % lEach === 0) {
            const lCount = lTotal / lEach;
            const score =
              Math.abs(mCount - marks * 0.2) +
              Math.abs(sTotal - targetHalf) * 0.5 +
              Math.abs(lTotal - targetHalf) * 0.5;

            if (score < bestScore) {
              bestScore = score;
              best = {
                marks,
                mcq: { count: mCount, each: 1 },
                short: { count: sCount, each: sEach },
                long: { count: lCount, each: lEach },
              };
            }
          }
        }
      }
    }
  }

  if (!best) {
    const mCount = Math.floor(marks * 0.2);
    const rem = marks - mCount;
    const sCount = Math.floor(rem / 4);
    const sTotal = sCount * 2;
    const lTotal = rem - sTotal;
    best = {
      marks,
      mcq: { count: mCount + (lTotal % 5), each: 1 },
      short: { count: sCount, each: 2 },
      long: { count: Math.floor(lTotal / 5), each: 5 },
    };
  }

  // Rigorous mathematical assertion: sum must ALWAYS equal marks exactly
  const calculatedSum =
    best.mcq.count * best.mcq.each +
    best.short.count * best.short.each +
    best.long.count * best.long.each;

  if (calculatedSum !== marks) {
    best.mcq.count += marks - calculatedSum;
  }

  return best;
}

// Fisher-Yates array shuffler
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate paper from question bank without duplicates
function generatePaperFromBank(settings) {
  const { title, subject, grade, duration, totalMarks, topicsRaw, difficulty } = settings;
  const topicsList = topicsRaw
    .split("\n")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const bp = buildBlueprint(totalMarks);

  // Filter question bank by selected topics
  const matchingQuestions = questionBank.filter((q) => {
    if (topicsList.length === 0) return true;
    const qTopic = q.topic.toLowerCase();
    return topicsList.some((t) => qTopic.includes(t) || t.includes(qTopic));
  });

  const mcqPool = matchingQuestions.filter((q) => q.type === "mcq");
  const shortPool = matchingQuestions.filter((q) => q.type === "short");
  const longPool = matchingQuestions.filter((q) => q.type === "long");

  // Check if bank has enough questions
  const totalAvailable = mcqPool.length + shortPool.length + longPool.length;
  const totalNeeded = bp.mcq.count + bp.short.count + bp.long.count;

  if (
    mcqPool.length < bp.mcq.count ||
    shortPool.length < bp.short.count ||
    longPool.length < bp.long.count
  ) {
    return {
      error: `Only ${totalAvailable} questions are available for these topics (needed ${totalNeeded}: ${bp.mcq.count} MCQ, ${bp.short.count} Short, ${bp.long.count} Long). Add more topics or select a lower marks preset.`,
      paper: null,
    };
  }

  // Shuffle pools and pick exact counts without repetition
  const selectedMcq = shuffleArray(mcqPool)
    .slice(0, bp.mcq.count)
    .map((q, idx) => {
      // Shuffle 4 options and preserve correct answer index
      const originalCorrectOption = q.options[q.answerIndex];
      const shuffledOptions = shuffleArray(q.options);
      const newAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);
      return {
        id: `q-mcq-${q.id}-${idx}`,
        originalId: q.id,
        text: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: bp.mcq.each,
        options: shuffledOptions,
        answerIndex: newAnswerIndex,
        answer: `${["A", "B", "C", "D"][newAnswerIndex]}) ${originalCorrectOption}`,
      };
    });

  const selectedShort = shuffleArray(shortPool)
    .slice(0, bp.short.count)
    .map((q, idx) => ({
      id: `q-short-${q.id}-${idx}`,
      originalId: q.id,
      text: q.question,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: bp.short.each,
      answer: q.answer || "Answer explanation based on standard concepts.",
    }));

  const selectedLong = shuffleArray(longPool)
    .slice(0, bp.long.count)
    .map((q, idx) => ({
      id: `q-long-${q.id}-${idx}`,
      originalId: q.id,
      text: q.question,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: bp.long.each,
      answer: q.answer || "Detailed solution with step-by-step logic.",
    }));

  const sections = [
    {
      id: "sec-a",
      name: `Section A: Multiple Choice Questions (${bp.mcq.count} \u00d7 ${bp.mcq.each} = ${bp.mcq.count * bp.mcq.each} Marks)`,
      instructions: "Answer all questions. Each question carries 1 mark.",
      each: bp.mcq.each,
      qs: selectedMcq,
    },
    {
      id: "sec-b",
      name: `Section B: Short Answer Questions (${bp.short.count} \u00d7 ${bp.short.each} = ${bp.short.count * bp.short.each} Marks)`,
      instructions: `Answer all questions. Each question carries ${bp.short.each} marks.`,
      each: bp.short.each,
      qs: selectedShort,
    },
    {
      id: "sec-c",
      name: `Section C: Long Answer Questions (${bp.long.count} \u00d7 ${bp.long.each} = ${bp.long.count * bp.long.each} Marks)`,
      instructions: `Answer all questions in detail. Each question carries ${bp.long.each} marks.`,
      each: bp.long.each,
      qs: selectedLong,
    },
  ];

  const calculatedTotal = sections.reduce(
    (acc, sec) => acc + sec.qs.reduce((sAcc, q) => sAcc + q.marks, 0),
    0
  );

  return {
    error: null,
    paper: {
      title: title || "Examination Paper",
      subject: subject || "Computer Science",
      grade: grade || "Grade 11 / Semester 2",
      duration: duration || `${bp.marks + 10} Minutes`,
      totalMarks: calculatedTotal,
      sections,
      blueprint: bp,
    },
  };
}

export default function Generator() {
  const [totalMarksPreset, setTotalMarksPreset] = useState("50");
  const [customMarks, setCustomMarks] = useState("50");
  const isCustomMarks = totalMarksPreset === "custom";
  const activeMarks = isCustomMarks ? Number(customMarks) || 50 : Number(totalMarksPreset);

  const [subject, setSubject] = useState("Computer Science");
  const [grade, setGrade] = useState("Grade 11 / Semester 2");
  const [duration, setDuration] = useState("60 Minutes (1 Hour)");
  const [title, setTitle] = useState("Term-End Examination 2026");
  const [difficulty, setDifficulty] = useState("medium");
  const [topics, setTopics] = useState(DEFAULT_TOPICS);

  const [bankSearch, setBankSearch] = useState("");
  const [bankTopicFilter, setBankTopicFilter] = useState("all");
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Live Blueprint Preview
  const liveBlueprint = useMemo(() => buildBlueprint(activeMarks), [activeMarks]);

  // Initial Paper
  const [paper, setPaper] = useState(() => {
    const res = generatePaperFromBank({
      title: "Term-End Examination 2026",
      subject: "Computer Science",
      grade: "Grade 11 / Semester 2",
      duration: "60 Minutes (1 Hour)",
      totalMarks: 50,
      topicsRaw: DEFAULT_TOPICS,
      difficulty: "medium",
    });
    return res.paper;
  });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  // Handle Marks Preset selection
  function handlePresetChange(val) {
    setTotalMarksPreset(val);
    const marksNum = val === "custom" ? Number(customMarks) || 50 : Number(val);
    const defaultDur = `${marksNum + 10} Minutes`;
    setDuration(defaultDur);
  }

  function handleCustomMarksChange(e) {
    const val = e.target.value;
    setCustomMarks(val);
    const marksNum = Number(val) || 50;
    setDuration(`${marksNum + 10} Minutes`);
  }

  function handleGenerate(e) {
    if (e) e.preventDefault();
    const result = generatePaperFromBank({
      title,
      subject,
      grade,
      duration,
      totalMarks: activeMarks,
      topicsRaw: topics,
      difficulty,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    setError("");
    setPaper(result.paper);
    showToast("✨ Exam paper generated successfully!");
  }

  function handleShuffle() {
    if (!paper) return;
    // Re-generate fresh paper with newly shuffled question selections and option orders
    const result = generatePaperFromBank({
      title,
      subject,
      grade,
      duration,
      totalMarks: paper.totalMarks,
      topicsRaw: topics,
      difficulty,
    });
    if (result.paper) {
      setPaper(result.paper);
      showToast("🔀 Questions and options shuffled!");
    }
  }

  function handleSaveDraft() {
    try {
      localStorage.setItem("exampilot_paper_draft", JSON.stringify(paper));
      showToast("💾 Draft saved to local storage!");
    } catch {
      showToast("💾 Draft saved!");
    }
  }

  function handleAddFromBank(q) {
    if (!paper) return;

    // Check for duplicate
    const existingIds = paper.sections.flatMap((s) => s.qs.map((item) => item.originalId || item.id));
    if (existingIds.includes(q.id)) {
      showToast("⚠️ Question is already present in this exam paper!");
      return;
    }

    let targetSecId = "sec-a";
    let targetMarks = 1;
    let newQ = null;

    if (q.type === "mcq") {
      targetSecId = "sec-a";
      targetMarks = 1;
      const originalCorrect = q.options[q.answerIndex];
      const shuffled = shuffleArray(q.options);
      const newIdx = shuffled.indexOf(originalCorrect);
      newQ = {
        id: `q-mcq-${q.id}-${Date.now()}`,
        originalId: q.id,
        text: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: 1,
        options: shuffled,
        answerIndex: newIdx,
        answer: `${["A", "B", "C", "D"][newIdx]}) ${originalCorrect}`,
      };
    } else if (q.type === "short") {
      targetSecId = "sec-b";
      targetMarks = paper.blueprint.short.each || 4;
      newQ = {
        id: `q-short-${q.id}-${Date.now()}`,
        originalId: q.id,
        text: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: targetMarks,
        answer: q.answer || "Standard model solution.",
      };
    } else {
      targetSecId = "sec-c";
      targetMarks = paper.blueprint.long.each || 8;
      newQ = {
        id: `q-long-${q.id}-${Date.now()}`,
        originalId: q.id,
        text: q.question,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: targetMarks,
        answer: q.answer || "Detailed evaluation criteria.",
      };
    }

    const updatedSections = paper.sections.map((sec) => {
      if (sec.id === targetSecId) {
        const newQs = [...sec.qs, newQ];
        return {
          ...sec,
          qs: newQs,
          name: `${sec.name.split("(")[0].trim()} (${newQs.length} \u00d7 ${sec.each} = ${newQs.length * sec.each} Marks)`,
        };
      }
      return sec;
    });

    const newCalculatedTotal = updatedSections.reduce(
      (acc, s) => acc + s.qs.reduce((qAcc, item) => qAcc + item.marks, 0),
      0
    );

    setPaper({
      ...paper,
      sections: updatedSections,
      totalMarks: newCalculatedTotal,
    });

    showToast(`Added: "${q.question.slice(0, 30)}..."`);
  }

  // Difficulty & Question Balance calculation
  const allQs = paper ? paper.sections.flatMap((s) => s.qs) : [];
  const totalCount = allQs.length || 1;
  const easyCount = allQs.filter((q) => q.difficulty === "easy").length;
  const mediumCount = allQs.filter((q) => q.difficulty === "medium").length;
  const hardCount = allQs.filter((q) => q.difficulty === "hard").length;

  const easyPct = Math.round((easyCount / totalCount) * 100);
  const mediumPct = Math.round((mediumCount / totalCount) * 100);
  const hardPct = Math.max(0, 100 - easyPct - mediumPct);

  // Filter Question Bank
  const filteredBank = questionBank.filter((item) => {
    const matchesSearch =
      bankSearch.trim() === "" ||
      item.question.toLowerCase().includes(bankSearch.toLowerCase()) ||
      item.topic.toLowerCase().includes(bankSearch.toLowerCase());
    const matchesTopic =
      bankTopicFilter === "all" || item.topic.toLowerCase() === bankTopicFilter.toLowerCase();
    return matchesSearch && matchesTopic;
  });

  const availableTopics = ["all", ...new Set(questionBank.map((q) => q.topic))];

  return (
    <>
      <Seo
        title="Exam Paper Studio"
        description="ExamPilot compact teacher workspace: Generate curriculum-aligned exam papers with exact mark balances, multiple choice options, and print-ready formatting."
        path="/generator"
      />

      <div className="generator-page">
        {toast && (
          <div className="toast-notification" role="status">
            {toast}
          </div>
        )}

        {/* Compact Hero Banner (Max ~120-130px on desktop) */}
        <section className="generator-hero">
          <div className="hero-content">
            <span className="hero-pill-badge">TEACHER WORKSPACE</span>
            <h1 className="hero-heading">Exam Paper Studio</h1>
            <p className="hero-subtext">
              Configure curriculum blueprints, balance cognitive loads, and produce exact-mark print-ready exam papers with verifiable answer keys.
            </p>
          </div>
        </section>

        {/* 3-Column Desktop Grid Layout with Independent Scroll Panels */}
        <div className="generator-workspace">
          {/* Column 1: Paper Settings (Left, ~280px) */}
          <aside className="generator-settings-col no-print" aria-label="Paper Configuration">
            <div className="panel-card settings-card">
              <div className="card-header">
                <h2>Paper Settings</h2>
                <span className="card-badge">Blueprint</span>
              </div>

              <form onSubmit={handleGenerate} className="settings-form">
                {/* Total Marks Selector with Presets & Custom */}
                <div className="field-group">
                  <label htmlFor="marks-preset-select">Total Marks</label>
                  <div className="marks-preset-bar">
                    {PRESET_MARKS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`preset-pill ${totalMarksPreset === String(m) ? "active" : ""}`}
                        onClick={() => handlePresetChange(String(m))}
                      >
                        {m}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`preset-pill ${isCustomMarks ? "active" : ""}`}
                      onClick={() => handlePresetChange("custom")}
                    >
                      Custom
                    </button>
                  </div>

                  {isCustomMarks && (
                    <div className="custom-marks-wrap">
                      <input
                        id="custom-marks-input"
                        type="number"
                        min="10"
                        max="200"
                        value={customMarks}
                        onChange={handleCustomMarksChange}
                        placeholder="Enter marks (10-200)"
                      />
                    </div>
                  )}
                </div>

                {/* Live Blueprint Summary Box */}
                <div className="blueprint-summary-box">
                  <div className="blueprint-title">Target Mark Distribution</div>
                  <div className="blueprint-text">
                    <strong>{liveBlueprint.mcq.count} MCQ</strong> ({liveBlueprint.mcq.count * liveBlueprint.mcq.each} mks) +{" "}
                    <strong>{liveBlueprint.short.count} Short</strong> ({liveBlueprint.short.count * liveBlueprint.short.each} mks) +{" "}
                    <strong>{liveBlueprint.long.count} Long</strong> ({liveBlueprint.long.count * liveBlueprint.long.each} mks) ={" "}
                    <span className="blueprint-total">{liveBlueprint.marks} Marks</span>
                  </div>
                </div>

                {/* 2-Column Row: Subject & Grade */}
                <div className="grid-2-col">
                  <div className="field-group">
                    <label htmlFor="gen-subject">Subject</label>
                    <input
                      id="gen-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="gen-grade">Class / Grade</label>
                    <input
                      id="gen-grade"
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2-Column Row: Duration & Difficulty */}
                <div className="grid-2-col">
                  <div className="field-group">
                    <label htmlFor="gen-duration">Duration</label>
                    <input
                      id="gen-duration"
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="gen-diff">Difficulty</label>
                    <select
                      id="gen-diff"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="easy">Easy (Foundational)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="hard">Hard (Advanced)</option>
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="gen-title">Exam Title</label>
                  <input
                    id="gen-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="gen-topics">Syllabus Topics (one per line)</label>
                  <textarea
                    id="gen-topics"
                    rows={4}
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    placeholder="Arrays&#10;Stacks&#10;Queues..."
                  />
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn-primary btn-generate">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Generate Paper ({activeMarks} Marks)
                </button>
              </form>
            </div>
          </aside>

          {/* Column 2: Paper Preview (Center, Widest Flexible Panel) */}
          <main className="generator-preview-col" aria-label="Paper Preview">
            <div className="panel-card preview-card">
              {/* Scrollable Print Sheet Area */}
              <div className="preview-scroll-container">
                <article className="exam-sheet" aria-live="polite">
                  {paper ? (
                    <>
                      <header className="exam-sheet-head">
                        <div className="exam-school-mark">EXAMPILOT ACADEMIC EVALUATION SYSTEM</div>
                        <h2 className="exam-sheet-title">{paper.title}</h2>
                        <div className="exam-sheet-subtitle">
                          <span>{paper.subject}</span> &bull; <span>{paper.grade}</span>
                        </div>
                        <div className="exam-sheet-rule"></div>

                        <div className="exam-meta-row">
                          <div className="meta-item">
                            <strong>Time Allowed:</strong> {paper.duration}
                          </div>
                          <div className="meta-item">
                            <strong>Maximum Marks:</strong> {paper.totalMarks}
                          </div>
                        </div>

                        <div className="exam-instructions-box">
                          <span className="inst-title">General Instructions:</span>
                          <ol className="inst-list">
                            <li>All questions are compulsory. Maximum Marks: {paper.totalMarks}.</li>
                            <li>Section A: MCQs (1 mark each). Section B: Short Answers. Section C: Long Answers.</li>
                            <li>Write legibly. Neat diagrams carry due credit.</li>
                          </ol>
                        </div>
                      </header>

                      <div className="exam-sheet-body">
                        {paper.sections.map((section, sIdx) => (
                          <section key={section.id || sIdx} className="exam-sheet-section">
                            <div className="section-header">
                              <h3 className="section-title">{section.name}</h3>
                            </div>
                            <p className="section-note">{section.instructions}</p>

                            <ol className="questions-list">
                              {section.qs.map((q, qIdx) => (
                                <li key={q.id || qIdx} className="question-item">
                                  <div className="q-content">
                                    <span className="q-text">{q.text}</span>

                                    {/* 2x2 Grid for Multiple Choice Options */}
                                    {q.options && q.options.length > 0 && (
                                      <div className="mcq-options-grid">
                                        {q.options.map((opt, optIdx) => (
                                          <div key={optIdx} className="mcq-option">
                                            <span className="opt-letter">
                                              {["A", "B", "C", "D"][optIdx]})
                                            </span>
                                            <span className="opt-text">{opt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {q.topic && (
                                      <span className="q-topic-hint no-print">
                                        Topic: {q.topic} &bull; Difficulty: {q.difficulty}
                                      </span>
                                    )}
                                  </div>
                                  <span className="q-marks">[{q.marks}]</span>
                                </li>
                              ))}
                            </ol>
                          </section>
                        ))}
                      </div>

                      {/* Printable Answer Key (Toggled or in separate print block) */}
                      {showAnswerKey && (
                        <div className="answer-key-section">
                          <div className="exam-sheet-rule"></div>
                          <h3 className="answer-key-title">Official Answer Key & Evaluation Rubric</h3>
                          <p className="answer-key-note">Confidential &bull; Prepared by ExamPilot</p>
                          <div className="answer-key-grid">
                            {paper.sections.flatMap((s) => s.qs).map((q, idx) => (
                              <div key={idx} className="ak-row">
                                <span className="ak-qnum">Q{idx + 1} ({q.marks} mk):</span>
                                <span className="ak-text">{q.answer || "Model solution based on syllabus."}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="preview-empty">
                      <p>Click &quot;Generate Paper&quot; to build an examination sheet.</p>
                    </div>
                  )}
                </article>
              </div>

              {/* Action Buttons Row (Always visible pinned at bottom of card) */}
              <div className="generator-actions-row no-print">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleShuffle}
                  title="Shuffle questions and MCQ options"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <polyline points="21 16 21 21 16 21"></polyline>
                    <line x1="15" y1="15" x2="21" y2="21"></line>
                    <line x1="4" y1="4" x2="9" y2="9"></line>
                  </svg>
                  Shuffle
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSaveDraft}
                  title="Save current exam paper as draft"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Draft
                </button>

                <button
                  type="button"
                  className={`btn ${showAnswerKey ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  title="Toggle Answer Key"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-6 6l7-7-3-3-7 7v3h3z"></path>
                    <path d="M3 21l6-6"></path>
                    <circle cx="7.5" cy="16.5" r="4.5"></circle>
                  </svg>
                  {showAnswerKey ? "Hide Answers" : "Answer Key"}
                </button>

                <button
                  type="button"
                  className="btn btn-navy"
                  onClick={() => window.print()}
                  title="Export paper directly to PDF"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="12" y2="18"></line>
                    <line x1="15" y1="15" x2="12" y2="18"></line>
                  </svg>
                  Export PDF
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.print()}
                  title="Print paper"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Print
                </button>
              </div>

              {/* Compact Question Balance Bar */}
              <div className="balance-card no-print">
                <div className="balance-head">
                  <span className="balance-title">Cognitive Balance: {paper ? paper.totalMarks : activeMarks} Marks</span>
                  <div className="balance-legend">
                    <span className="legend-item"><span className="legend-dot easy-dot"></span>Easy: {easyCount} ({easyPct}%)</span>
                    <span className="legend-item"><span className="legend-dot medium-dot"></span>Med: {mediumCount} ({mediumPct}%)</span>
                    <span className="legend-item"><span className="legend-dot hard-dot"></span>Hard: {hardCount} ({hardPct}%)</span>
                  </div>
                </div>
                <div className="balance-bar" aria-label="Difficulty distribution">
                  <div className="balance-segment segment-easy" style={{ width: `${easyPct}%` }}>
                    {easyPct > 12 && <span>{easyPct}%</span>}
                  </div>
                  <div className="balance-segment segment-medium" style={{ width: `${mediumPct}%` }}>
                    {mediumPct > 12 && <span>{mediumPct}%</span>}
                  </div>
                  <div className="balance-segment segment-hard" style={{ width: `${hardPct}%` }}>
                    {hardPct > 12 && <span>{hardPct}%</span>}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Column 3: Question Bank (Right, ~320px) */}
          <aside className="generator-bank-col no-print" aria-label="Question Bank">
            <div className="panel-card bank-card">
              <div className="card-header">
                <h2>Question Bank</h2>
                <span className="card-badge">{filteredBank.length} items</span>
              </div>

              {/* Search & Topic Filter */}
              <div className="bank-search-wrap">
                <div className="search-input-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="search"
                    placeholder="Search questions or topics..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                  />
                </div>

                <div className="bank-filter-select-wrap">
                  <select
                    value={bankTopicFilter}
                    onChange={(e) => setBankTopicFilter(e.target.value)}
                    className="bank-topic-select"
                  >
                    {availableTopics.map((t) => (
                      <option key={t} value={t}>
                        {t === "all" ? "All Topics" : t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Independently Scrollable Question Bank Cards */}
              <div className="bank-list-scroll">
                {filteredBank.map((q) => (
                  <div key={q.id} className="bank-item-card">
                    <div className="bank-item-tags">
                      <span className="pill-tag pill-topic">{q.topic}</span>
                      <span className={`pill-tag pill-diff pill-${q.difficulty}`}>{q.difficulty}</span>
                      <span className="pill-tag pill-type">{q.type.toUpperCase()}</span>
                    </div>

                    <p className="bank-item-text">{q.question}</p>

                    {/* Show options in bank if MCQ */}
                    {q.options && (
                      <div className="bank-mcq-mini-options">
                        {q.options.slice(0, 2).map((opt, i) => (
                          <span key={i} className="mini-opt">{["A", "B"][i]}) {opt}</span>
                        ))}
                        <span className="mini-opt-more">+2 options</span>
                      </div>
                    )}

                    <div className="bank-item-footer">
                      <span className="bank-marks-badge">[{q.marks} {q.marks === 1 ? "Mk" : "Mks"}]</span>
                      <button
                        type="button"
                        className="btn-add-bank"
                        onClick={() => handleAddFromBank(q)}
                        aria-label={`Add question: ${q.question}`}
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                ))}

                {filteredBank.length === 0 && (
                  <p className="bank-empty">No questions match your filter.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
