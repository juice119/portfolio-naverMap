require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var mainRouter = require('./routes/main');
var postRouter = require('./routes/post');
var drivingRouter = require('./routes/driving');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());

//router
app.use('/', mainRouter);
app.use('/post', postRouter);
app.use('/driving', drivingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
