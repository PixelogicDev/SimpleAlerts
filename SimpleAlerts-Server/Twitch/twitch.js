const https = require('https');
const authBaseHostName = 'id.twitch.tv';
const apiBaseHostName = 'api.twitch.tv';

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
              token = JSON.parse(tokenJson.toString());
            });

            response.on('end', () => {
              console.log('Promise resolved.');
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
    var userInfoRequest = https
      .request(
        {
          method: 'GET',
          hostname: apiBaseHostName,
          path: '/helix/users',
          headers: { Authorization: `Bearer ${token}` }
        },
        response => {
          response.on('data', userInfo => {
            console.log(`TOKEN: ${token}`);

            // Can request multiple users at a time, which is why we only get the first user //
            var userInfoArray = JSON.parse(userInfo.toString());
            console.log(userInfoArray);
            var user = userInfoArray.data[0];
            var userJson = {
              displayName: user.display_name,
              email: user.email
            };

            return Promise(resolve => {
              resolve(userJson);
            });
          });
        }
      )
      .on('error', error => {
        console.log('Error thrown in User Info request:');
        console.error(error);
      });

    // End the request //
    userInfoRequest.end();
  }
};
