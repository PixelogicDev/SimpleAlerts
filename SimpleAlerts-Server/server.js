//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//
require('dotenv').config();
const express = require('express');
const streamlabs = require('./streamlabs/streamlabs');
const db = require('./database/db');
const apiBase = '/api/v1/';
const https = require('https');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express();

// Body Parser //
server.use(bodyParser.json());

// Setup CORS //
server.use(cors());

server.listen(process.env.PORT || 8000, () => {
  if (process.env.NODE_ENV === 'dev') {
    console.log('Server started on port: 8000');
  } else {
    console.log('Server started on port: ' + process.env.PORT);
  }
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
  token.catch(error => {
    console.log(`[getAuthToken] ${error}`);
  });

  // Get user data from Streamlabs //
  streamlabsUser = await streamlabs.getUserInfo(token);
  streamlabsUser.catch(error => {
    console.log(`[getUserInfo] ${error}`);
  });

  // Check to see if user is part of SimpleAlerts //
  user = await db.findUser(streamlabsUser.twitch.id);

  // If no user object is returned, create new user in DB //
  if (user === null) {
    // Create new user in db //
    user = await db.addNewUser(streamlabsUser.twitch, token);
  }

  user.catch(error => {
    console.log(`[findUser] ${error}`);
  });

  // Given access_token, get socket tocken //
  var socketToken = await streamlabs.getSocketToken(token);
  socketToken.catch(error => {
    console.log(`[getSocketToken] ${error}`);
  });

  // Setup socket to receive alert //
  streamlabs.setupSocket(socketToken, user.username);

  response.send(user);
});

server.post(apiBase + 'settings/:username', async (request, response) => {
  // Request.body passes over array of eventLists and username //
  var didUpdate = await db.updateSettings(request.body);
  didUpate.catch(error => {
    console.log(`[updateSettings] ${error}`);
  });

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
