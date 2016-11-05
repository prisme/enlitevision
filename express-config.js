var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path');

module.exports = function() {
  var app = express();

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  // app.use(favicon(__dirname + '/public/images/favicon.png'));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(errorHandler());

  app.use('/public', express.static(path.join(__dirname, 'public')));

  return app;
}();
