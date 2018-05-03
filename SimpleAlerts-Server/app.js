//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const raven = require('./utilities/raven');

if (process.env.NODE_ENV === 'production') {
  raven.instance
    .config(process.env.RAVEN_PATH, {
      autoBreadcrumbs: true
    })
    .install();

  // Add raven request handler //
  app.use(raven.instance.requestHandler());

  // Add error handler //
  app.use(raven.instance.errorHandler());
}

// Body Parser //
app.use(bodyParser.json());

app.use(cors());

module.exports = app;
