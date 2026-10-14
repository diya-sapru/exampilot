const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const app = express();
const PORT = 5000;

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
    const { name, email, phone, dob, exam } = req.body;

    if (!name || !email || !phone || !dob || !exam) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check for duplicate email
    if (fs.existsSync(studentsFile)) {
      const contents = fs.readFileSync(studentsFile, "utf8");
      const lines = contents.trim().split(/\r?\n/);

      if (lines.length > 1) {
        const existingEmails = lines.slice(1).map((line) =>
          line.split(",")[2]?.replace(/^"|"$/g, "").toLowerCase()
        );

        if (existingEmails.includes(email.toLowerCase())) {
          return res.status(409).json({
            success: false,
            message: "This email is already registered.",
          });
        }
      }
    }

    const student = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      dob,
      exam,
      created_at: new Date().toISOString(),
    };

    await csvWriter.writeRecords([student]);

    res.status(201).json({
      success: true,
      message: "Student saved successfully!",
      student,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Could not save student.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`ExamPilot backend running at http://localhost:${PORT}`);
});
