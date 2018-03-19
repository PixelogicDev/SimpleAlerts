const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var db;

// Use connect method to connect to the server
MongoClient.connect(process.env.DB_URL, function(err, client) {
  assert.equal(null, err);
  console.log('Database connection was successful.');

  db = client.db(process.env.DB_NAME);
});

module.exports = {
  // Twitch user ID //
  addNewUser: async userID => {
    let usersCollection = db.collection('users');

    return new Promise((resolve, reject) => {
      // Check for user in DB //
      usersCollection.findOne({ _id: userID }, (findError, user) => {
        if (findError) return reject('[addNewUser] ' + findError);

        // Check to see if user was found //
        if (user === null) {
          // User not found, lets add them //
          usersCollection.insertOne({ _id: userID }, (insertError, data) => {
            if (error) console.log('[addNewUser] ' + insertError);

            console.log('[addNewUser] Added new');
          });
        }
      });

      // Insert user if not there, else don't do anything //
    });
  }
};
