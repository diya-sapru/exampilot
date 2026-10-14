require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createObjectCsvWriter } = require("csv-writer");

const app = express();
const PORT = 5000;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Check your .env file.");
}

app.use(cors());
app.use(express.json());

const studentsFile = path.join(__dirname, "students.csv");

const csvWriter = createObjectCsvWriter({
  path: studentsFile,
  header: [
    { id: "id", title: "id" },
{ id: "name", title: "name" },
{ id: "email", title: "email" },
{ id: "phone", title: "phone" },
{ id: "dob", title: "dob" },
{ id: "exam", title: "exam" },
{ id: "password_hash", title: "password_hash" },
{ id: "created_at", title: "created_at" },
  ],
  append: fs.existsSync(studentsFile) &&
    fs.statSync(studentsFile).size > 0,
});

app.get("/", (req, res) => {
  res.json({
    application: "ExamPilot",
    message: "Backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

// Register student and save to CSV
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, dob, exam, password } = req.body;

    if (!name || !email || !phone || !dob || !exam || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 8 characters long.",
  });
}

const passwordHash = await bcrypt.hash(password, 12);
    // Check for duplicate email
    
const normalizedEmail = email.trim().toLowerCase();

const existingStudents = readCsv(studentsFile);

if (
  existingStudents.some(
    (student) =>
      String(student.email || "").trim().toLowerCase() === normalizedEmail
  )
) {
  return res.status(409).json({
    success: false,
    message: "This email is already registered.",
  });
}


    const student = {
  id: Date.now().toString(),
  name,
  email: normalizedEmail,
  phone,
  dob,
  exam,
  password_hash: passwordHash,
  created_at: new Date().toISOString(),
};

    await csvWriter.writeRecords([student]);

    
return res.status(201).json({
  success: true,
  message: "Student saved successfully!",
  student: {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    dob: student.dob,
    exam: student.exam,
    created_at: student.created_at,
  },
});

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Could not save student.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const student = readCsv(studentsFile).find(
      (s) => String(s.email || "").trim().toLowerCase() === normalizedEmail
    );

    if (!student || !student.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Existing accounts may need to register again.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      student.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        exam: student.exam,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});


const papersFile = path.join(__dirname, "sample_papers.csv");
const attemptsFile = path.join(__dirname, "practice_attempts.csv");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token.",
    });
  }
}

// Helper: read CSV rows (prototype only; handles simple CSV data)

function readCsv(file) {
  if (!fs.existsSync(file)) return [];

  const content = fs.readFileSync(file, "utf8").trim();
  if (!content) return [];

  const lines = content.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse CSV rows while respecting quoted commas.
  function parseCsvLine(line) {
    const values = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        values.push(value);
        value = "";
      } else {
        value += char;
      }
    }

    values.push(value);
    return values;
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    const record = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });

    // Older records may not have a password hash.
    if (!record.password_hash) {
      record.password_hash = "";
    }

    return record;
  });
}


// 1. Get student profile by email
app.get("/api/student/profile", authenticateToken, (req, res) => {
  const email = String(req.student.email || "").trim().toLowerCase();

  

  const student = readCsv(studentsFile).find(
    (s) => String(s.email || "").toLowerCase() === email
  );

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found.",
    });
  }

  // Do not expose unnecessary personal information
  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      exam: student.exam,
    },
  });
});

// 2. Get papers for a student
app.get("/api/student/papers", authenticateToken, (req, res) => {
  const email = String(req.student.email || "").trim().toLowerCase();

  

  const papers = readCsv(papersFile).filter(
    (paper) => String(paper.student_email || "").toLowerCase() === email
  );

  res.json({ success: true, papers });
});

// 3. Get practice progress for a student
app.get("/api/student/progress", authenticateToken, (req, res) => {
  const email = String(req.student.email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Student email is required.",
    });
  }

  const attempts = readCsv(attemptsFile).filter(
    (attempt) => String(attempt.student_email || "").toLowerCase() === email
  );

  const scores = attempts
    .map((attempt) => Number(attempt.score))
    .filter((score) => Number.isFinite(score));

  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  res.json({
    success: true,
    totalAttempts: attempts.length,
    averageScore,
    attempts,
  });
});

app.listen(PORT, () => {
  console.log(`ExamPilot backend running at http://localhost:${PORT}`);
});
