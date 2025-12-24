const express = require('express');
const path = require('path');
const db = require('./bin/db');
const fs = require('fs');

const homeRouter = require('./routes/home');
const todosRouter = require('./routes/todos');
const asteroidsRouter = require('./routes/asteroids');

const app = express();

//Ensure the data directory exists

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const dbFileName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(dataDir, dbFileName);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const databaseManager = db.createDatabaseManager(dbPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to attach database to request
app.use((request, response, next) => {
  request.db = databaseManager.dbHelpers;
  next();
});
app.use('/', homeRouter);
app.use('/todos', todosRouter);
app.use('/asteroids', asteroidsRouter);

// Add test route in test environment
if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./routes/test-api');
  console.log('Test API routes enabled');
  app.use('/test-api', testRouter);
}

module.exports = app;
