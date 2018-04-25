//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch');
const streamlabs = require('./streamlabs/streamlabs');
const db = require('./database/db');
const apiBase = '/api/v1/';
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const server = express();
var sessionProps = {
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: false
  },
  resave: false,
  saveUninitialized: false
};

// Body Parser //
server.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  server.set('trust proxy', 1);
  sessionProps.cookie.secure = true;
}

// Session Manager //
// server.use(session(sessionProps));

// Setup CORS //
server.use(cors());

server.listen(8000, () => {
  console.log('Server started on port: 8000');
});

// -- Routes -- //
server.get('/', (request, response) => {
  response.send('Hit /');
});

server.post(apiBase + 'streamlabs/token', async (request, response) => {
  //-- User property --//
  var user = null;

  // Use code from client to request token //
  var authCode = request.body.code;

  // Given code, need to get auth token for requests //
  var token = await streamlabs.getAuthToken(authCode);

  // Get user data from Streamlabs //
  streamlabsUser = await streamlabs.getUserInfo(token);

  // Check to see if user is part of SimpleAlerts //
  user = await db.findUser(streamlabsUser.twitch.id);

  // If no user object is returned, create new user in DB //
  if (user === null) {
    // Create new user in db //
    user = await db.addNewUser(streamlabsUser.twitch, token);
  }

  // Given access_token, get socket tocken //
  var socketToken = await streamlabs.getSocketToken(token);

  // Setup socket to receive alert //
  streamlabs.setupSocket(socketToken, user.username);

  response.send(user);
});

server.post(apiBase + 'settings/:username', async (request, response) => {
  // Request.body passes over array of eventLists and username //
  var didUpdate = await db.updateSettings(request.body);

  if (didUpdate) {
    response.send(
      JSON.stringify({
        status: 'OK'
      })
    );
  } else {
    response.send(JSON.stringify({ status: 'NOTOK' }));
  }
});

// Twitch Token Request //
/*server.post(apiBase + 'twitch/token', async (request, response) => {
  //-- User property --//
  var user = null;

  // Use code from client to request token //
  var authCode = request.body.code;

  // Given code, need to get auth token for requests //
  var token = await twitch.getAuthToken(authCode);

  // After login, store auth token in session //
  // request.session.token = token;

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

  // If user is live, setup webhook //
  var stream = await twitch.getStreamStatus(user);

  if (stream !== null) {
    console.log('User live, lets setup follower webhook.');
    twitch.configFollowerWebhook(user, token, 'subscribe');
  } else {
    console.log('User is offline. Config Stream Status Webhook.');
  }

  twitch.configStreamStatusWebhook(user, token, 'subscribe');

  // Setup PubSub //
  twitch.setupPubSub(token);

  // Send data to client //
  response.send(user);
});

// Twitch Follower Webhook //
server.all('/hook/follower/:id', (request, response) => {
  if (request.method === 'GET') {
    if (request.query['hub.mode'] === 'denied') {
      console.log('Follow Webhook Denied.');
      console.log(request.query['hub.reason']);
    } else {
      console.log('Follow Webhook Accepted. Returning challenge...');
      response.status(200, {
        'Content-Type': 'text/plain'
      });
      response.end(request.query['hub.challenge']);
      console.log('Challenge sent.');
    }
  }

  if (request.method === 'POST') {
    console.log('New Follower!');
    console.log(request.body.data);
    response.status(200);
  }
});

// Twitch Stream Up/Down Webhook //
server.all('/hook/stream/status/:id', async (request, response) => {
  // Get user id param //
  var userID = request.params.id;
  // Get user from DB //
  var user = await db.findUser(userID);
  // Get Oauth Token from session cookie //
  // var token = request.session.token;

  // console.log('TOKEN: ' + token);

  if (request.method === 'GET') {
    if (request.query['hub.mode'] === 'denied') {
      console.log('Twitch Stream Up/Down Webhook Denied.');
      console.log(request.query['hub.reason']);
    } else {
      console.log(
        'Twitch Stream Up/Down Webhook Accepted. Returning challenge...'
      );
      response.status(200, {
        'Content-Type': 'text/plain'
      });
      response.end(request.query['hub.challenge']);
      console.log('Challenge sent.');
    }
  }

  if (request.method === 'POST') {
    console.log('Stream Status Change.');

    var data = request.body.data[0];
    console.log(data);

    if (data.length > 0) {
      console.log('Stream up. Subscribing to Follow Hook...');
      // twitch.configFollowerWebhook(user, token, 'subscribe');
      // Need to setup pub sub stuff here as //
    } else {
      console.log('Stream down.');
      // twitch.configFollowerWebhook(user, token, 'unsubscribe');
    }

    response.status(200);
  }
}); */
