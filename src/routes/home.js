const express = require('express');
const router = express.Router();

// Landing page
router.get('/', function(req, res) {
  const total = req.db.getTotalTodos();
  const completed = req.db.getCompletedTodos();
  const pending = total - completed;
  res.render('index', { title: 'Hello World', stats: { total, completed, pending } });
});

module.exports = router;
