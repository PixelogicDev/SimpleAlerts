const https = require('https');
const authBaseHostName = 'id.twitch.tv';
const apiBaseHostName = 'api.twitch.tv';
const channelEndpoint = '/kraken/channels/';
const webhookPath = '/helix/webhooks/hub';
const pubSubPath = 'wss://pubsub-edge.twitch.tv';
const WebSocket = require('ws');
// const socket = new WebSocket(pubSubPath);

//-- Helpers --//
var tokenPathBuilder = code => {
  return (
    `/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}` +
    `&client_secret=${process.env.TWITCH_SECRET}` +
    `&code=${code}` +
    `&grant_type=authorization_code` +
    `&redirect_uri=${process.env.TWITCH_REDIRECT_URI}`
  );
};

//-- PubSub Socket Helpers --//
// https://github.com/twitchdev/pubsub-samples/blob/master/javascript/main.js //
/* var nonceGenerator = size => {
  var value = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < size; i++) {
    value += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return value;
};

var heartbeat = () => {
  message = {
    type: 'PING'
  };

  socket.send(JSON.stringify(message));
  console.log('PING sent.');
};

var listen = (topics, token) => {
  message = {
    type: 'LISTEN',
    nonce: nonceGenerator(15),
    data: { topics: topics, auth_token: token }
  };

  socket.send(JSON.stringify(message));
  console.log('LISTEN sent.');
};

var connect = () => {
  var heartbeatInterval = 1000 * 60; //ms between PING's
  var reconnectInterval = 1000 * 3; //ms to wait before reconnect
  var heartbeatHandle;

  socket.on('open', () => {
    console.log('PubSub socket open.');
    heartbeat();
    heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
  });

  socket.on('error', () => {
    console.log('PubSub socket error: ' + error);
  });

  socket.on('message', event => {
    console.log(event);
    var message = JSON.parse(event.type);

    console.log('PubSub message received: ' + message);
    if (event.type === 'RECONNECT') {
      console.log('Reconnecting...');
      setTimeout(connect, reconnectInterval);
    }
  });

  socket.on('close', () => {
    onsole.log('PubSub socket closed.');
    clearInterval(heartbeatHandle);
    setTimeout(connect, reconnectInterval);
  });
}; */

module.exports = {
  // This will return a token as a promise for our next call //
  getAuthToken: async code => {
    let token;

    return new Promise((resolve, reject) => {
      console.log('[getAuthToken] Starting auth token request...');

      https
        .request(
          {
            method: 'POST',
            hostname: authBaseHostName,
            path: tokenPathBuilder(code),
            headers: {
              accept: 'application/vnd.twitchtv.v5+json'
            }
          },
          response => {
            response.on('data', tokenJson => {
              console.log('[getAuthToken] Response received.');
              token = JSON.parse(tokenJson.toString());
            });

            response.on('end', () => {
              console.log('[getAuthToken] Promise resolved.');
              resolve(token.access_token);
            });
          }
        )
        .on('error', error => {
          console.log(error);
          reject(error);
        })
        .end();
    });
  },

  // This will take in a Twitch Oauth code to make request //
  getUserInfo: async token => {
    let userJson;

    return new Promise((resolve, reject) => {
      console.log('[getUserInfo] Starting auth token request...');

      https
        .request(
          {
            method: 'GET',
            hostname: apiBaseHostName,
            path: '/helix/users',
            headers: {
              Authorization: `Bearer ${token}`
            }
          },
          response => {
            response.on('data', userInfo => {
              console.log('[getUserInfo] Response Received.');

              // Can request multiple users at a time, which is why we only get the first user //
              var usersData = JSON.parse(userInfo.toString());

              if (usersData.length === 0) {
                return reject(
                  '[getUserInfo] There was no data in the response.'
                );
              }

              var user = usersData.data[0];
              userJson = {
                userID: user.id,
                displayName: user.display_name,
                email: user.email
              };
            });

            response.on('end', () => {
              console.log('[getUserInfo] Promise resolved.');
              resolve(userJson);
            });
          }
        )
        .on('error', error => {
          console.log(error);
          reject(error);
        })
        .end();
    });
  },

  setupFollowerWebhook: (userData, token) => {
    console.log('[setupFollowerWebhook] Starting...');

    console.log('Follow Hook: ' + userData.followHook);
    // Create json body params, passes back MongoDB object //
    var hookParams = JSON.stringify({
      'hub.callback': userData.followHook,
      'hub.mode': 'subscribe',
      'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${
        userData._id
      }`,
      'hub.lease_seconds': 864000
    });

    // Create & submit request //
    var request = https.request(
      {
        method: 'POST',
        hostname: apiBaseHostName,
        path: webhookPath,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': hookParams.length
        }
      },
      response => {
        response.on('error', error => {
          console.log(error);
        });

        response.on('data', data => {
          /* No data comes back, but this is required */
        });

        response.on('end', () => {
          if (response.statusCode === 202) {
            console.log(
              '[setupFollowerWebhook] Follower webhook is listening.'
            );
          } else {
            console.log('[setupFollowerWebhook] Follower webhook was denied.');
          }
        });
      }
    );

    // Request fanciness //
    request.on('error', error => {
      console.log(error);
    });
    request.write(hookParams);
    request.end();
  }

  /* setupPubSub: token => {
    // Connect to web socket //
    connect();

    // Listen to event //
    var bits = `channel-bits-events-v1.${process.env.TEST_TWITCH_ID}`;
    var subs = `channel-subscribe-events-v1.${process.env.TEST_TWITCH_ID}`;

    console.log(token);

    listen([bits, subs], token);
  } */
};
