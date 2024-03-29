var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    expressBeautify = require('express-beautify'),
    http = require('http'),
    path = require('path');

module.exports = function() {
  var app = express();

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(favicon('public/img/favicon.png'));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(errorHandler());
  app.use(expressBeautify());

  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/googlef9a3f7af3a6fba0b.html ', express.static(path.join(__dirname, 'googlef9a3f7af3a6fba0b.html')));
  app.use('/', express.static(path.join(__dirname)));

  return app;
}();
