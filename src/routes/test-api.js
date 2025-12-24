const express = require('express');
const router = express.Router();

// Route to clear the database (for testing purposes)
router.post('/clear-database', (req, res) => {
  try {
    req.db.clearDatabase();
    res.status(200).json({ message: 'Database cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

router.post('/seed-database', (req, res) => {
  try {
    req.db.seedTestData();
    res.status(200).json({ message: 'Database seeded with test data' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

module.exports = router;