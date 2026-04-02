const express = require("express");
const router = express.Router();
const db = require("../db/database");

// 🎟️ BOOK TICKET
router.post("/", (req, res) => {
  const { name, email, route, total_cost } = req.body;

  const isSuccess = Math.random() > 0.3;
  const status = isSuccess ? "SUCCESSFUL" : "FAILED";

  const bookingId = "BK" + Date.now().toString().slice(-5);

  if (!isSuccess) {
    return res.json({
      booking_id: bookingId,
      status: status
    });
  }

  db.run(
    `INSERT INTO bookings (name, email, route, total_cost, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, JSON.stringify(route), total_cost, status],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        booking_id: bookingId,
        status: status
      });
    }
  );
});

// 📜 GET BOOKINGS
router.get("/", (req, res) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

module.exports = router;
