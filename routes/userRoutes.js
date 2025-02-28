const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Resignation = require("../models/Resignation");
const ExitResponse = require("../models/ExitResponse");

const router = express.Router();

// Check if a date is a weekend
const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 6 || day === 0; // Saturday (6) or Sunday (0)
};

// Submit Resignation
router.post("/resign", authMiddleware(["employee"]), async (req, res) => {
  try {
    const { lwd } = req.body;

    if (!lwd || isNaN(new Date(lwd).getTime())) {
      return res.status(400).json({ message: "Invalid last working day format" });
    }

    if (isWeekend(lwd)) {
      return res.status(400).json({ message: "Resignation date cannot be on a weekend" });
    }

    const resignation = new Resignation({
      employeeId: req.user.id,
      lwd,
      status: "Pending",
    });
    await resignation.save();

    res.json({ message: "Resignation submitted successfully", data: { resignation } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit Exit Questionnaire
router.post("/responses", authMiddleware(["employee"]), async (req, res) => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "Invalid responses format" });
    }

    const exitResponse = new ExitResponse({ employeeId: req.user.id, responses });
    await exitResponse.save();

    res.json({ message: "Responses submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
