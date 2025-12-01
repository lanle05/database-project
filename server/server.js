import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./db.js"; // The .js extension is REQUIRED here

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---

// 1. REGISTER STUDENT
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, departmentId, level, gender, dob, email } =
      req.body;

    const currentYear = new Date().getFullYear();
    const randId = Math.floor(1000 + Math.random() * 9000);
    const studentId = `SID-${currentYear}-${randId}`;
    const matricNo = `MAT/${currentYear}/${Math.floor(Math.random() * 1000)}`;

    const sql = `
      INSERT INTO Student 
      (student_id, matric_no, first_name, last_name, department_id, programme_id, gender, dob, email) 
      VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
    `;

    await db.execute(sql, [
      studentId,
      matricNo,
      firstName,
      lastName,
      departmentId,
      gender,
      dob,
      email,
    ]);

    const cardNum = `ID-${currentYear}-${randId}`;
    const expiryDate = `${currentYear + 4}-12-31`;

    await db.execute(
      `INSERT INTO Identity_Card (card_number, student_id, issue_date, expiry_date, status_id)
       VALUES (?, ?, CURDATE(), ?, 1)`,
      [cardNum, studentId, expiryDate]
    );

    res
      .status(201)
      .json({ message: "Student registered", studentId, matricNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ALL STUDENTS
app.get("/api/students", async (req, res) => {
  try {
    const sql = `
      SELECT s.student_id, s.first_name, s.last_name, s.matric_no, 
             d.name as department, cs.status_name as status
      FROM Student s
      LEFT JOIN Department d ON s.department_id = d.dept_id
      LEFT JOIN Identity_Card ic ON s.student_id = ic.student_id
      LEFT JOIN Card_Status cs ON ic.status_id = cs.status_id
    `;
    const [rows] = await db.execute(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. VERIFY ID
app.get("/api/verify/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT s.first_name, s.last_name, s.matric_no, 
             d.name as department, cs.status_name, ic.expiry_date
      FROM Student s
      JOIN Identity_Card ic ON s.student_id = ic.student_id
      JOIN Card_Status cs ON ic.status_id = cs.status_id
      JOIN Department d ON s.department_id = d.dept_id
      WHERE s.student_id = ? OR s.matric_no = ?
    `;

    const [rows] = await db.execute(sql, [id, id]);

    if (rows.length > 0) {
      const data = rows[0];
      const isExpired = new Date(data.expiry_date) < new Date();
      const isValid = data.status_name === "Active" && !isExpired;
      res.json({ valid: isValid, data: data });
    } else {
      res.json({ valid: false, message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. FETCH DEPARTMENTS
app.get("/api/departments", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Department");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE STUDENT
app.delete("/api/students/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM Student WHERE student_id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
