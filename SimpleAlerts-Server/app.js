//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const raven = require('./utilities/raven');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  next();
});

// Body Parser //
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  raven.instance
    .config(process.env.RAVEN_PATH, { autoBreadcrumbs: true })
    .install();

  // Add raven request handler //
  app.use(raven.instance.requestHandler());

  // Add error handler //
  app.use(raven.instance.errorHandler());
}

module.exports = app;
