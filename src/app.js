
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const dynamicRouter = require('./routes/dynamic')

const app = express();
import { getConfigurations } from './lib/configuration'
import { getAdapter } from './lib/file-adapter';
import { getResourcesRouter } from './routes/resources'
const adapter = getAdapter()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

setupRouting();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function setupRouting() {
  app.use('/', indexRouter);
  app.use('/resources', getResourcesRouter());
  const configurations = getConfigurations();
  let idx
  for (idx in configurations) {
    const config = configurations[idx];
    const resourceName = config.resourceName;
    app.use('/' + resourceName, dynamicRouter.getRoute(config, adapter));
  }

}

module.exports = app;