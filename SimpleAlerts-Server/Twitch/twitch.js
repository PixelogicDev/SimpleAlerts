const https = require('https');
const authBaseHostName = 'id.twitch.tv';
const apiBaseHostName = 'api.twitch.tv';
const webhookPath = '/helix/webhooks/hub';

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
      'hub.lease_seconds': 20000
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
};
