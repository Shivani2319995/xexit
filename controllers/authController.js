const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Hardcoded HR Login
    if (username === process.env.HR_USERNAME && password === process.env.HR_PASSWORD) {
      const token = jwt.sign({ username, role: "HR" }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        token,
        user: { username, role: "HR" }
      });
    }

    // 🔍 Check in Database for Employee Login
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
