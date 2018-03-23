const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const randomString = require('randomstring');
const localtunnel = require('localtunnel');
const twitch = require('../Twitch/twitch');
var db;
var basePath;

// Use connect method to connect to the server
MongoClient.connect(process.env.DB_URL, async (err, client) => {
  assert.equal(null, err);
  console.log('Database connection was successful.');

  db = client.db(process.env.DB_NAME);

  if (process.env.NODE_ENV === 'dev') {
    basePath = await createTunnel();
  } else {
    basePath = process.env.BASE_URL;
  }
});

var createFollowHookRoute = userID => {
  var rand = randomString.generate({ length: 8, charset: 'alphanumeric' });
  return `${basePath}/hook/${rand}/follower/${userID.substring(0, 4)}`;
};

var createTunnel = () => {
  return new Promise((resolve, reject) => {
    var tunnel = localtunnel(8000, (tunnelErr, tunnel) => {
      if (tunnelErr) {
        console.log(tunnelErr);
        return reject(null);
      }

      console.log('Public tunnel: ' + tunnel.url);
      return resolve(tunnel.url);
    });

    tunnel.on('close', () => {
      console.log('Tunnel is closed.');
    });
  });
};

module.exports = {
  findUser: userID => {
    // Use Twitch ID to check for user in DB //
    let usersCollection = db.collection('users');

    return new Promise((resolve, reject) => {
      console.log('[findUser] Starting...');
      usersCollection.findOne(
        {
          _id: userID
        },
        (error, user) => {
          if (error) {
            console.log('[findUser] ' + error);
            return reject(error);
          }

          if (user === null) return resolve(null);

          console.log('[findUser] User found. Returning.');
          if (process.env.NODE_ENV === 'dev') {
            user.followHook = createFollowHookRoute(user._id);
          }
          return resolve(user);
        }
      );
    });
  },

  // Twitch user ID //
  addNewUser: userData => {
    return new Promise((resolve, reject) => {
      console.log('[addNewUser] Starting...');

      let usersCollection = db.collection('users');
      let followHook = createFollowHookRoute(userData.userID);
      let userObject = {
        _id: userData.userID,
        twitchDisplayName: userData.displayName,
        twitchEmail: userData.email,
        followHook: followHook
      };

      usersCollection.insertOne(userObject, (insertError, data) => {
        if (insertError) {
          console.log('[addNewUser] ' + insertError);
          return reject('[addNewUser] ' + insertError);
        }

        console.log(`[addNewUser] New user has been inserted.`);
        return resolve(userObject);
      });
    });
  }
};
