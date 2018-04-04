// ws://localhost:8080
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
var currentSocket;

wss.on('connection', ws => {
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
  streamData: data => {
    console.log('Sending stream data to client...');
    wss.clients.forEach(client => {
      client.send(data);
    });
    console.log('Data has been sent.');
  }
};
