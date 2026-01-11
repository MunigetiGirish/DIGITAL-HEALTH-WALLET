const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const path = require("path");

/* ================================
   SHARE REPORTS
================================ */
router.post("/", auth, (req, res) => {
  const { report_ids, shared_with_email, relation } = req.body;

  const stmt = db.prepare(
    "INSERT INTO shared_reports (report_id, owner_id, shared_with_email, relation) VALUES (?,?,?,?)"
  );

  report_ids.forEach(id => {
    stmt.run(id, req.user.id, shared_with_email, relation);
  });

  stmt.finalize();
  res.json({ msg: "Shared" });
});

/* ================================
   REPORTS SHARED WITH ME
================================ */
router.get("/shared-with-me", auth, (req, res) => {
  db.all(
    `
    SELECT 
      r.id,
      r.report_type,
      r.report_date,
      r.file_path,
      s.relation,
      u.name AS patient_name,
      u.email AS patient_email
    FROM shared_reports s
    JOIN reports r ON s.report_id = r.id
    JOIN users u ON r.owner_id = u.id
    WHERE s.shared_with_email = ?
    `,
    [req.user.email],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ================================
   REPORTS I SHARED
================================ */
router.get("/shared-by-me", auth, (req, res) => {
  db.all(
    `
    SELECT 
      r.id,
      r.report_type,
      r.report_date,
      s.shared_with_email,
      s.relation
    FROM shared_reports s
    JOIN reports r ON s.report_id = r.id
    WHERE s.owner_id = ?
    `,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ================================
   DOCTOR / FAMILY DOWNLOAD
================================ */
router.get("/download/:id", auth, (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM reports WHERE id=?", [id], (err, report) => {
    if (!report) return res.status(404).json({ msg: "Not found" });

    db.get(
      "SELECT * FROM shared_reports WHERE report_id=? AND shared_with_email=?",
      [id, req.user.email],
      (err, shared) => {
        if (!shared) return res.status(403).json({ msg: "Access denied" });

        res.download(path.resolve(report.file_path));
      }
    );
  });
});

module.exports = router;
