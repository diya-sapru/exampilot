import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";




const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAPERS_FILE = path.join(__dirname, "papers.json");

async function readPapers() {
  try {
    return JSON.parse(await fs.readFile(PAPERS_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function savePapers(papers) {
  await fs.writeFile(
    PAPERS_FILE,
    JSON.stringify(papers, null, 2),
    "utf8"
  );
}


app.use(cors());
app.use(express.json());

// Test whether the backend is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ExamPilot backend is running!"
  });
});


 // Generate and save a practice paper using Gemini
app.post("/api/generate", async (req, res) => {
  const { className, subject, topics, marks, difficulty } = req.body;
  const totalMarks = Number(marks);

  if (
    !className ||
    !subject ||
    !topics ||
    !Number.isInteger(totalMarks) ||
    totalMarks < 10 ||
    totalMarks > 100 ||
    !["Easy", "Medium", "Hard"].includes(difficulty)
  ) {
    return res.status(400).json({
      success: false,
      error:
        "Provide class, subject, topics, marks (10–100), and difficulty (Easy, Medium, or Hard)."
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: "Gemini API key is missing from server/.env."
    });
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const prompt = `
Create a school practice question paper using only the supplied topics.

Class: ${String(className).slice(0, 80)}
Subject: ${String(subject).slice(0, 100)}
Topics: ${String(Array.isArray(topics) ? topics.join(", ") : topics).slice(0, 3000)}
Total marks: ${totalMarks}
Difficulty: ${difficulty}

Requirements:
- Give the paper a clear title and instructions.
- Number all questions and show marks for each question.
- Make the sum of question marks equal exactly ${totalMarks}.
- Include an answer key in a separate section at the end.
- Use age-appropriate language.
- This is practice material, not an official exam.
Return the paper as readable text.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.error("Gemini API error:", response.status, data);
  return res.status(502).json({
    success: false,
    error: data.error?.message || "Gemini API request failed",
    status: response.status
  });
}

    const paperText = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    if (!paperText) {
      return res.status(502).json({
        success: false,
        error: "Gemini returned an empty paper."
      });
    }

    const paper = {
      id: randomUUID(),
      title: `Class ${className} ${subject} Practice Paper`,
      className,
      subject,
      topics,
      difficulty,
      totalMarks,
      content: paperText,
      createdAt: new Date().toISOString()
    };

    const papers = await readPapers();
    papers.unshift(paper);
    await savePapers(papers);

    return res.status(201).json({
      success: true,
      message: "Practice paper generated and saved!",
      paper
    });
  } catch (error) {
    console.error("Paper generation/storage error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Could not generate or save the paper."
    });
  }
});

app.get("/api/papers", async (req, res) => {
  try {
    const papers = await readPapers();
    res.json({ success: true, papers });
  } catch (error) {
    console.error("Reading saved papers failed:", error.message);
    res.status(500).json({
      success: false,
      error: "Could not load saved papers."
    });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found."
  });
});

app.listen(PORT, () => {
  console.log(`ExamPilot backend running on http://localhost:${PORT}`);
});
