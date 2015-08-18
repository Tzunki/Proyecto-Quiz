var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');
var routes = require('./routes/index');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(partials());
app.use(cookieParser('Quiz 2015'));
app.use(session());

//helpers dinámicos
app.use(function(req, res, next){
  //guardar path en session.redir para después de login/logout
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }
  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next){
  //Si han transcurrido más de 2min desde la última transacción hace auto-logout
  //Guardamos los minutos actuales
  var minutesNow = new Date()/60000;
  //Si no existe sesión no es necesario hacer nada
  if(req.session.user){
    //Si es la primera transacción tan solo guardaremos los minutos actuales en la sesión
    if(req.session.user.lastActionTime){
      //Si han pasado más de 2min desde la última transacción destruimos sesión
      if((req.session.user.lastActionTime + 2) < (minutesNow)){
        delete req.session.user;
      }
      //Si no han pasado 2min actualizamos los minutos de la última acción de la sesión
      else{
        req.session.user.lastActionTime = minutesNow;
      }
    }
    else{
      req.session.user.lastActionTime = minutesNow;
    }
  }
  next();
});

app.use('/', routes);

// error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
