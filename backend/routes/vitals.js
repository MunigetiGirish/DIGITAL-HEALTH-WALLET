const express = require("express");
const auth = require("../middleware/auth");
const db = require("../db");
const router = express.Router();

router.post("/", auth, (req, res) => {
  const { vital_type, value, recorded_at } = req.body;

  db.run(
    "INSERT INTO vitals (user_id,vital_type,value,recorded_at) VALUES (?,?,?,?)",
    [req.user.id, vital_type, value, recorded_at],
    () => res.json({ msg: "Vital added" })
  );
});

router.get("/", auth, (req, res) => {
  const { from, to } = req.query;

  let query = "SELECT * FROM vitals WHERE user_id=?";
  let params = [req.user.id];

  if (from && to) {
    query += " AND recorded_at BETWEEN ? AND ?";
    params.push(from, to);
  }

  db.all(query, params, (_, rows) => res.json(rows));
});

module.exports = router;
