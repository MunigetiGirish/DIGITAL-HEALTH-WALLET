const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");
const auth = require("../middleware/auth");
const path = require("path");
const fs = require("fs");

// ================= FILE STORAGE =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);   // keep extension
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// ================= UPLOAD REPORT =================
router.post("/upload", auth, upload.single("file"), (req, res) => {
  const { report_type, report_date, vitals } = req.body;

  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  db.run(
    `INSERT INTO reports (owner_id, report_type, report_date, vitals, file_path)
     VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, report_type, report_date, vitals, req.file.path],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Report uploaded", id: this.lastID });
    }
  );
});

// ================= GET REPORTS =================
router.get("/", auth, (req, res) => {
  const { date, report_type, vitals } = req.query;

  let q = "SELECT * FROM reports WHERE owner_id=?";
  let p = [req.user.id];

  if (date) { q += " AND report_date=?"; p.push(date); }
  if (report_type) { q += " AND report_type=?"; p.push(report_type); }
  if (vitals) { q += " AND vitals LIKE ?"; p.push(`%${vitals}%`); }

  db.all(q, p, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= DOWNLOAD REPORT =================
router.get("/download/:id", auth, (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM reports WHERE id=?", [id], (err, report) => {
    if (!report) return res.status(404).json({ msg: "Not found" });

    const filePath = path.resolve(report.file_path);

    // Patient → Download
    if (report.owner_id === req.user.id) {
      return res.download(filePath);
    }

    // Doctor / Family → Must be shared
    db.get(
      "SELECT * FROM shared_reports WHERE report_id=? AND shared_with_email=?",
      [id, req.user.email],
      (err, shared) => {
        if (!shared) return res.status(403).json({ msg: "Access denied" });
        res.download(filePath);
      }
    );
  });
});

// ================= DELETE REPORT =================
router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM reports WHERE id=?", [id], (err, report) => {
    if (!report) return res.status(404).json({ msg: "Report not found" });

    // Only owner can delete
    if (report.owner_id !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Delete from database
    db.run("DELETE FROM reports WHERE id=?", [id], err => {
      if (err) return res.status(500).json(err);

      // Delete file from uploads folder
      fs.unlink(report.file_path, () => {});

      res.json({ msg: "Report deleted successfully" });
    });
  });
});

module.exports = router;
