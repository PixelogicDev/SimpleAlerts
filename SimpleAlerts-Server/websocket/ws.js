require('dotenv').config();
const WSServer = require('ws').Server;
let server;
server = require('http').createServer();
const app = require('../app');
const db = require('../database/db');
const wss = new WSServer({
  server: server
});
const raven = require('../utilities/raven');
const streamlabs = require('../streamlabs/streamlabs');
// -- Props -- //
const apiBase = '/api/v1/';

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
    user = await db.addNewUser(streamlabsUser.twitch).catch(error => {
      console.log(`[findUser] ${error}`);
      raven.logException(`[findUser] ${error}`);
    });
  }

  // Given access_token, get socket token //
  var socketToken = await streamlabs.getSocketToken(token).catch(error => {
    console.log(`[getSocketToken] ${error}`);
    raven.logException(`[getSocketToken] ${error}`);
  });

  // Setup socket to receive alert //
  streamlabs.setupSocket(socketToken, user.username, wss.clients);

  // Pass user object to client //
  response.send({
    user: user
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

// https://stackoverflow.com/questions/34808925/express-and-websocket-listening-on-the-same-port?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// Mount app on server //
server.on('request', app);

// Setup on connection //
wss.on('connection', (ws, request) => {
  console.log(`[${request.url}] Connected to SimpleAlerts Socket`);

  ws.isAlive = true;

  // Set Id on socket //
  ws.id = request.url;

  var response = JSON.stringify({
    type: 'connection_open',
    data: 'Thanks for connecting to SimpleAlerts WebSocket!'
  });

  ws.send(response);

  //-- OnMessage --//
  ws.on('message', message => {});

  ws.on('close', reason => {
    console.log(`[${ws.id}] Closing socket connection...`);
    // Close SimpleAlerts Socket //
    ws.close();

    // Close Streamlabs Socket //
    // TODO: Figure out if this needs to be closed or not //
    // streamlabs.closeSocket(ws.id.split('=')[1]);

    console.log(`[${ws.id}] WS connection closed.`);
  });

  // Verify the connection is still alive //
  ws.on('pong', () => {
    heartbeat(ws);
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
const noop = () => {};

// Called when ping is sent //
const heartbeat = ws => {
  ws.isAlive = true;
}

// Fires a check every 15s to see if socket is still alive //
setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.close();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 15000);