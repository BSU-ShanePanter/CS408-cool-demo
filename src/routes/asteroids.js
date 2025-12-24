const express = require('express');
const router = express.Router();

// Asteroids game view
router.get('/', function(req, res) {
  res.render('asteroids');
});

module.exports = router;
