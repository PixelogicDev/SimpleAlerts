//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch');
const apiBase = '/api/v1/';
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

// Body Parser //
app.use(bodyParser.json());

// PROPS TO: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue //
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.listen(8000, () => {
  console.log('Server started on port: 8000');
});

// -- Routes -- //
app.get('/', (request, response) => {
  response.send('Hit /');
});

// Twitch Token Request //
app.post(apiBase + 'twitch/token', async (request, response) => {
  // Use code from client to request token //
  var authCode = request.body.code;

  console.log('AUTHCODE: ' + authCode);

  // Request token //
  var token = await twitch.getAuthToken(authCode);

  console.log(`TOKEN IN SERVER: ${token}`);

  // Get user data to send back to client //
  //var userJson = await twitch.getUserInfo(token);
  response.send('userJson');
  // Send data to client //
  //response.send(userJson);
});
