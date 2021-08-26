var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { sequelize } = require('./models');

var indexRouter = require('./routes/index');

var app = express();

//Testing connection to database & syncing model
(async () => {
  await sequelize.sync();
  try {
      await sequelize.authenticate();
      console.log('Successful connection to database!');
  } catch (error) {
      console.error('Unsuccessful connection to the database: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// 404 error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  res.status(404).render('page-not-found', { err });
});

// Global error handler
app.use(function(err, req, res, next) {
  if(err.status === 404){
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = (err.message || 'Oops! Something went wrong - please try again.');
    res.status(err.status||500).render('error', {err})
  }
});

module.exports = app;
