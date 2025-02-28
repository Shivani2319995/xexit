const express = require('express');
const jwt = require('jsonwebtoken');
const ExitResponse = require('../models/ExitResponse');
const Resignation = require('../models/Resignation');

const router = express.Router();

// Employee submits exit interview responses
router.post('/responses', async (req, res) => {
  const token = req.headers['authorization'];
  const { responses } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resignation = await Resignation.findOne({ employeeId: decoded.userId, status: 'approved' });

    if (!resignation) {
      return res.status(400).json({ message: 'You cannot submit an exit interview unless your resignation is approved' });
    }

    const exitResponse = new ExitResponse({ employeeId: decoded.userId, responses });
    await exitResponse.save();

    res.status(200).json({ message: 'Exit interview submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin views all exit interview responses
router.get('/exit_responses', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view exit responses' });
    }

    const exitResponses = await ExitResponse.find().populate('employeeId', 'username');
    res.status(200).json({ data: exitResponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
