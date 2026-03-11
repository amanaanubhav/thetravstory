const express = require('express');
const router = express.Router();

console.log('Test routes initializing...');

// Simple test route
router.get('/ping', (req, res) => {
  console.log('Ping route called');
  res.json({ message: 'Pong! Routes are working!' });
});

module.exports = router;