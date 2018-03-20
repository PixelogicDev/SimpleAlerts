const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db;

// Use connect method to connect to the server
MongoClient.connect(process.env.DB_URL, function(err, client) {
  assert.equal(null, err);
  console.log('Database connection was successful.');

  db = client.db(process.env.DB_NAME);
});

var findUser = userID => {
  // Use Twitch ID to check for user in DB //
  let usersCollection = db.collection('users');

  return new Promise((resolve, reject) => {
    usersCollection.findOne(
      {
        _id: userID
      },
      (error, user) => {
        if (error) {
          console.log('[findUser] ' + error);
          return reject(null);
        }

        if (user === null) return resolve(false);

        return resolve(user);
      }
    );
  });
};

module.exports = {
  // Twitch user ID //
  addNewUser: async userData => {
    let usersCollection = db.collection('users');

    console.log('[addNewUser] Starting...');

    // Check for user in DB //
    var user = await findUser(userData.userID);

    if (user) {
      // Return user settings from DB //
      console.log('[addNewUser] User found.');
      return;
    }

    console.log('[addNewUser] User not found. Inserting...');
    // User not found, lets add them //
    usersCollection.insertOne(
      {
        _id: userData.userID,
        twitchDisplayName: userData.displayName,
        twitchEmail: userData.email
      },
      (insertError, data) => {
        if (insertError) {
          console.log('[addNewUser] ' + insertError);
          return;
        }
        console.log(`[addNewUser] New user has been inserted.`);
      }
    );
  }
};
