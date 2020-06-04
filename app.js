require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var favicon = require('serve-favicon');
const flash = require('connect-flash');
const passport =  require('passport');  

const { sequelize } = require('./models');
const passportConfig = require('./passport');

var mainRouter = require('./routes/main');
var postRouter = require('./routes/post');
var historyRouter = require('./routes/history');
var authRouter = require('./routes/auth');
var app = express();

//module option setting
passportConfig(passport);
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//router
app.use('/', mainRouter);
app.use('/history', historyRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);

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
