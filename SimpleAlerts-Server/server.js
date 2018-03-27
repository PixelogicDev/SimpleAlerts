//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch');
const db = require('./database/db');
const apiBase = '/api/v1/';
const https = require('https');
const bodyParser = require('body-parser');
const server = express();

// Body Parser //
server.use(bodyParser.json());

// PROPS TO: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue //
server.use(function(req, res, next) {
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

server.listen(8000, () => {
  console.log('Server started on port: 8000');
});

// -- Routes -- //
server.get('/', (request, response) => {
  response.send('Hit /');
});

// Twitch Token Request //
server.post(apiBase + 'twitch/token', async (request, response) => {
  //-- User property --//
  var user = null;

  // Use code from client to request token //
  var authCode = request.body.code;

  // Given code, need to get auth token for requests //
  var token = await twitch.getAuthToken(authCode);

  // User just logged back in, lets find out who they are //
  var userJson = await twitch.getUserInfo(token);

  if (process.env.NODE_ENV === 'dev') {
    console.log('In dev env. Using other user ID.');
    // Use Dr. Disrespect's Twitch ID to hook into followers/subs //
    userJson.userID = process.env.TEST_TWITCH_ID;
  }

  // Check to see if user is part of SimpleAlerts //
  user = await db.findUser(userJson.userID);

  // If no user object is returned, create new user in DB //
  if (user === null) {
    // Create new user in db //
    user = await db.addNewUser(userJson, token);
  }

  // After data is here, setup webhooks //
  twitch.setupFollowerWebhook(user, token);
  //twitch.setupPubSub(token);

  // Send data to client //
  response.send(user);
});

// Twitch Follower Webhook //
server.all('/hook/follower/:id', (request, response) => {
  console.log('Twitch Follower Webhook.');

  if (request.method === 'GET') {
    if (request.query['hub.mode'] === 'denied') {
      console.log('Follow Webhook Denied.');
      console.log(request.query['hub.reason']);
    } else {
      console.log('Follow Webhook Accepted. Returning challenge...');
      response.status(200, { 'Content-Type': 'text/plain' });
      response.end(request.query['hub.challenge']);
    }
  }

  if (request.method === 'POST') {
    console.log('New Follower!');
    console.log(request.body.data);
  }
});
