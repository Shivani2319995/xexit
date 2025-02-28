const express = require("express");
const Resignation = require("../models/Resignation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// View Resignations
// Submit a new resignation (Admin only)
router.post("/resignations", authMiddleware(["hr","employee"]), async (req, res) => {
    try {
      const { employeeId, lwd } = req.body;
  
      if (!employeeId || !lwd) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const newResignation = new Resignation({
        employeeId,
        lwd,
        status: "pending",
      });
  
      await newResignation.save();
      res.status(201).json({ message: "Resignation submitted", data: newResignation });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
router.get("/resignations", authMiddleware(["hr", "employee"]), async (req, res) => {
  const resignations = await Resignation.find().populate("employeeId", "username");
  res.json({ data: resignations });
});

// Approve/Reject Resignation
router.put("/conclude_resignation", authMiddleware(["hr", "admin"]), async (req, res) => {
  const { resignationId, approved, lwd } = req.body;
  
  const status = approved ? "approved" : "rejected";
  await Resignation.findByIdAndUpdate(resignationId, { status, lwd });

  res.json({ message: `Resignation ${status}` });
});

module.exports = router;
