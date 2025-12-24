var express = require('express');
var router = express.Router();

/* GET home (landing) page. */
router.get('/', function(req, res, next) {
  const total = req.db.getTotalTodos();
  const completed = req.db.getCompletedTodos();
  const pending = total - completed;
  res.render('index', { title: 'Hello World', stats: { total, completed, pending } });
});

router.get('/todos', function(req, res, next) {
  const todos = req.db.getAllTodos();
  res.render('todos', { todos });
});

router.get('/asteroids', function(req, res, next) {
  res.render('asteroids.ejs');
});


module.exports = router;
