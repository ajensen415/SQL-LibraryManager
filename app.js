var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var booksRouter = require('./routes/books');

var app = express();

const { sequelize } = require('./models/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/books', booksRouter);


//Testing connection to database & syncing model
(async () => {
  try {
      await sequelize.authenticate();
      console.log('Successful connection to database!');
  } catch (error) {
      console.error('Unsuccessful connection to the database: ', error);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = 'Oops! Page not found.';
  next(err);
});

app.use(function(err, req, res, next) {
  if(err.status === 404) {
    res.locals.error = err;
    res.render('page-not-found');
  } else if(!err.status === 404) {
    err.status = 500;
    err.message = 'Oops! Something went wrong - please try again.';
    res.locals.error = err;
    res.render('error', { err });
  }

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
