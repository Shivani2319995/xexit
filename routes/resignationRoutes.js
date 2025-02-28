const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Resignation = require("../models/Resignation");
const User = require("../models/User");

const router = express.Router();

// Resignation Submission (Employee)
router.post("/resign", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.error("Error: Missing authorization token");
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("Error: User not found for ID:", decoded.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched User from DB:", user);

    if (!user.country) {
      console.error("Error: User country is missing:", user);
      return res.status(400).json({ message: "User country not found" });
    }

    return res.json({ message: "Debugging Complete, No Issues Found" });

  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
