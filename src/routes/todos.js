const express = require('express');
const router = express.Router();

// Root - List all
router.get('/', function (req, res) {
    const todos = req.db.getAllTodos();
    res.render('todos',
        {
            todos
        });
});

// Create
router.post('/create', function (req, res) {
    const { task } = req.body;
    if (task) {
        req.db.createTodo(task);
    }
    res.redirect('/todos');
});

// Delete
router.post('/delete', function (req, res) {
    const { id } = req.body;
    if (id) {
        req.db.deleteTodo(id);
    }
    res.redirect('/todos');
});

// Toggle completion status
router.post('/toggle', function (req, res) {
    const { id } = req.body;
    if (id) {
        req.db.toggleTodo(id);
    }
    res.redirect('/todos');
});

module.exports = router;
