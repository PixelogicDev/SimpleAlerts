const https = require('https');
const authBaseHostName = 'streamlabs.com';
const StreamlabsSocketClient = require('streamlabs-socket-client');
var client = null;

//-- Helpers --//
var streamData = (data, username, clients) => {
  clients.forEach(client => {
    if (client.id === `/?user=${username}`) {
      client.send(data);
      return;
    }
  });
};

var tokenBodyBuilder = code => {
  return JSON.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.STREAMLABS_CLIENT_ID,
    client_secret: process.env.STREAMLABS_SECRET,
    redirect_uri: process.env.STREAMLABS_REDIRECT_URI,
    code: code
  });
};

var eventDataParser = (event, type) => {
  var eventObj;

  switch (type) {
    case 'new_follower':
      eventObj = JSON.stringify({
        type: type,
        data: {
          id: event._id,
          timestamp: new Date(),
          from: event.name,
          isTest: event.isTest
        }
      });
      break;
    case 'new_donation':
      eventObj = JSON.stringify({
        type: type,
        data: {
          id: event.id,
          timestamp: new Date(),
          from: event.from,
          amount: event.amount,
          stringAmount: event.formattedAmount,
          currency: event.currency,
          message: event.message,
          isTest: event.isTest
        }
      });
      break;
    case 'new_subscription':
      var subMonths = event.months;
      var tier = event.sub_plan;
      var subTiers = [1000, 2000, 3000];

      // For testing filter by sub tier and month resub //
      if (process.env.NODE_ENV === 'dev') {
        subMonths = Math.floor(Math.random() * 24);
        tier = subTiers[Math.floor(Math.random() * 3)];
      }

      eventObj = JSON.stringify({
        type: type,
        data: {
          id: event._id,
          timestamp: new Date(),
          from: event.name,
          months: subMonths,
          message: event.message,
          sub_plan: tier,
          isTest: event.isTest
        }
      });
      break;
    case 'new_resubscription':
      eventObj = JSON.stringify({
        type: type,
        data: {
          id: event._id,
          timestamp: new Date(),
          name: event.from,
          months: event.months,
          message: event.message,
          sub_plan: event.sub_plan,
          isTest: event.isTest
        }
      });
      break;
    case 'new_cheer':
      eventObj = JSON.stringify({
        type: type,
        data: {
          id: event._id,
          timestamp: new Date(),
          from: event.name,
          amount: event.amount,
          stringAmount: event.formattedAmount,
          message: event.message,
          isTest: event.isTest
        }
      });
      break;
      defualt: console.log(`[eventDataParser] ${type} not found.`);
      return;
  }
  return eventObj;
};

module.exports = {
  getAuthToken: code => {
    let token;

    return new Promise((resolve, reject) => {
      console.log('[getAuthToken] Starting auth token request...');

      // Create body params //
      var bodyData = tokenBodyBuilder(code);

      var request = https.request(
        {
          method: 'POST',
          hostname: authBaseHostName,
          path: '/api/v1.0/token',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': bodyData.length
          }
        },
        response => {
          response.on('data', tokenJson => {
            console.log('[getAuthToken] Response received.');
            token = JSON.parse(tokenJson.toString());
          });

          response.on('end', () => {
            resolve(token.access_token);
          });
        }
      );

      request.on('error', error => {
        console.log(error);
        reject(error);
      });

      request.write(bodyData);
      request.end();
    });
  },

  getSocketToken: accessToken => {
    return new Promise((resolve, reject) => {
      request = https
        .request(
          {
            method: 'GET',
            hostname: authBaseHostName,
            path: `/api/v1.0/socket/token?access_token=${accessToken}`,
            headers: {
              accept: 'application/json'
            }
          },
          response => {
            response.on('data', tokenJson => {
              token = JSON.parse(tokenJson.toString());
            });

            response.on('end', () => {
              resolve(token.socket_token);
            });
          }
        )
        .on('error', error => {
          reject(error);
          console.log('[getSocketToken] Error received');
        })
        .end();
    });
  },

  setupSocket: (socketToken, username, clients) => {
    if (client === null || !client.client.connected) {
      client = new StreamlabsSocketClient({
        token: socketToken,
        emitTests: true,
        rawEvent: ['connect']
      });

      client.on('follow', follower => {
        var followerObj = eventDataParser(follower, 'new_follower');
        streamData(followerObj, username, clients);
      });

      client.on('donation', donation => {
        var donationObj = eventDataParser(donation, 'new_donation');
        streamData(donationObj, username, clients);
      });

      client.on('subscription', subscription => {
        var subscriptionObj = eventDataParser(subscription, 'new_subscription');
        streamData(subscriptionObj, username, clients);
      });

      client.on('resubscription', resubscription => {
        var resubscriptionObj = eventDataParser(
          resubscription,
          'new_resubscription'
        );
        streamData(resubscriptionObj, username, clients);
      });

      client.on('bits', bits => {
        var bitsObj = eventDataParser(bits, 'new_cheer');
        streamData(bitsObj, username, clients);
      });

      client.connect();
    } else {
      console.log('Client already connected.');
    }
  },

  getUserInfo: token => {
    return new Promise((resolve, reject) => {
      var userData;

      var request = https.get(
        `https://streamlabs.com/api/v1.0/user?access_token=${token}`,
        response => {
          if (response.statusCode === 400) {
            console.log('[getUserInfo] Error requesting user from Streamlabs.');
            reject(`${response.error}: ${response.message}`);
            return;
          }

          response.on('data', data => {
            userData = data;
          });

          response.on('end', () => {
            resolve(JSON.parse(userData.toString()));
          });
        }
      );
      request.on('error', error => {
        console.log('[getUserInfo] ERROR: ' + error);
        reject(error);
        return;
      });

      request.end();
    });
  }
};
