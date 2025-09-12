const express = require('express');
const router = express.Router();

// In-memory store (prototype only)
let memoryBridge = [];

// POST: Add a zap
router.post('/', (req, res) => {
  const zap = req.body;
  // Basic validation
  if (!zap.zap_id || !zap.persona || !zap.text || !zap.timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  memoryBridge.push(zap);
  res.status(201).json({ success: true });
});

// GET: Fetch all zaps
router.get('/', (req, res) => {
  res.json(memoryBridge);
});

module.exports = router;