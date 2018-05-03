// ws://<urlpath>:8000 || process port
require('dotenv').config();
const WSServer = require('ws').Server;
let server;
// if (process.env.NODE_ENV === 'dev') {
server = require('http').createServer();
// } else {
//   server = require('https').createServer();
// }
const app = require('../app');
const db = require('../database/db');
const wss = new WSServer({
  server: server
});
const raven = require('../utilities/raven');
const streamlabs = require('../streamlabs/streamlabs');
// -- Props -- //
const apiBase = '/api/v1/';
let wsClients = new Array();

// Define routes //
app.get('/', (request, response) => {
  response.send('Welcome To SimpleAlerts');
});

app.post(apiBase + 'streamlabs/token', async (request, response) => {
  //-- User property --//
  var user = null;

  // Use code from client to request token //
  var authCode = request.body.code;

  // Given code, need to get auth token for requests //
  var token = await streamlabs.getAuthToken(authCode).catch(error => {
    console.log(`[getAuthToken] ${error}`);
    raven.logException(`[getAuthToken] ${error}`);
  });

  // Get user data from Streamlabs //
  var streamlabsUser = await streamlabs.getUserInfo(token).catch(error => {
    console.log(`[getUserInfo] ${error}`);
    raven.logException(`[getUserInfo] ${error}`);
  });

  // Check to see if user is part of SimpleAlerts //
  user = await db.findUser(streamlabsUser.twitch.id).catch(error => {
    console.log(`[findUser] ${error}`);
    raven.logException(`[findUser] ${error}`);
  });

  // If no user object is returned, create new user in DB //
  if (user === null) {
    // Create new user in db //
    user = await db.addNewUser(streamlabsUser.twitch, token).catch(error => {
      console.log(`[findUser] ${error}`);
      raven.logException(`[findUser] ${error}`);
    });
  }

  // Given access_token, get socket tocken //
  var socketToken = await streamlabs.getSocketToken(token).catch(error => {
    console.log(`[getSocketToken] ${error}`);
    raven.logException(`[getSocketToken] ${error}`);
  });

  // Setup socket to receive alert //
  streamlabs.setupSocket(socketToken, user.username, wsClients);

  // Pass port so the websocket knows where to listen to //
  response.send({
    user: user,
    port: process.env.PORT || 8000
  });
});

app.post(apiBase + 'settings/:username', async (request, response) => {
  // Request.body passes over array of eventLists and username //
  var didUpdate = await db.updateSettings(request.body).catch(error => {
    raven.logException(`[updateSettings] ${error}`);
  });

  if (didUpdate) {
    response.send(
      JSON.stringify({
        status: `${request.body.username} updated`
      })
    );
  } else {
    response.send(
      JSON.stringify({
        status: `${request.body.username} failed to updated.`
      })
    );
  }
});

app.options('/*', (request, response) => {
  console.log('Received options. Handeling...');
  if (process.env.NODE_ENV === 'dev') {
    response.header('Access-Control-Allow-Origin', '*');
  } else {
    response.header(
      'Access-Control-Allow-Origin',
      'https://www.simplealerts.stream'
    );
  }

  response.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,OPTIONS'
  );

  response.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );

  response.send(204);
});

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// Mount app on server //
server.on('request', app);

// Setup on connection //
wss.on('connection', (ws, request) => {
  console.log(`${request.url} connected to SimpleAlerts Socket`);

  // Set Id on socket //
  ws.id = request.url;

  // Push to local array //
  wsClients.push(ws);

  var response = JSON.stringify({
    type: 'connection_open',
    data: 'Thanks for connecting to SimpleAlerts WebSocket!'
  });

  ws.send(response);

  //-- OnMessage --//
  ws.on('message', message => {
    // Check for 'close' message; if close that means page refreshed or page closed. //
    if (message === 'close') {
      console.log('Closing socket...');
      findCloseSocket(ws);
    }
  });
});

// Listen to server //
server.listen(process.env.PORT || 8000, () => {
  if (process.env.NODE_ENV === 'dev') {
    console.log('Server started on port: 8000');
  } else {
    console.log('Server started on port: ' + process.env.PORT);
  }
});

//-- Helpers --//
var findCloseSocket = ws => {
  var socketIndex = wsClients.findIndex(item => {
    return item.id === ws.id;
  });

  if (socketIndex !== -1) {
    console.log('Found socket, closing...');
    wsClients[socketIndex].close;
    wsClients.splice(socketIndex, 1);
    console.log('Socket closed.');
  } else {
    console.log('Socket not found.');
    raven.logException(
      `[findCloseSocket] socket could not be found and closed.`
    );
  }
};
