var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
//var products_save = require('./seed/products');
var session = require('express-session');
const express_validator = require('express-validator');
const passport = require('passport');
var routes = require('./routes/index');
var userRoutes  =require('./routes/user');
var flash = require('connect-flash');
var connect_mongo = require('connect-mongo')(session);
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


require('./config/passport');
//require('./models/user.js');
var app = express();
app.use(express_validator());
// view engine setup
app.engine('hbs', expressHbs({defaultLayout: 'layout', extname: 'hbs', layoutsDir:'views/layouts'}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret:'keyboardcat',
  resave:false,
  saveUninitialized:false,
  store: new connect_mongo({mongooseConnection: require('./config/db').connection }),
  cookie: { maxAge: 180*60*1000}
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.login  = req.user;//user req.isAuthenticated()
  res.locals.session = req.session;
  next();
})
app.use('/user', userRoutes);
app.use('/', routes);

// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
