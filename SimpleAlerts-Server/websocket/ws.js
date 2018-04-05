// ws://localhost:8080
const WebSocket = require('ws');
const db = require('../database/db');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, request) => {
  // Set Id on socket //
  ws.id = request.url;

  ws.on('message', message => {
    console.log('New Message Received: ' + message);
  });

  var response = JSON.stringify({
    type: 'connection_open',
    data: 'Thanks for connecting to SimpleAlerts WebSocket!'
  });

  ws.send(response);
});

module.exports = {
  streamData: (data, username) => {
    console.log('Sending stream data to client...');

    wss.clients.forEach(client => {
      if (client.id === `/?user=${username}`) {
        console.log('Socket found, sending data...');
        client.send(data);
        console.log('Data has been sent.');
        return;
      }
    });
  }
};
