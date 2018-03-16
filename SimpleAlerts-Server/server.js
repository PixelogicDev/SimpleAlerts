//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//

require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch.js');
const apiBase = '/api/v1/';
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

// PROPS TO: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue //
app.use(function (req, res, next) {
    // Body Parser //
    bodyParser.json();
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(8000, () => {
    console.log('Server started on port: 8000');
});

app.get('/', (request, response) => {
    response.send('Hit /');
});

// Twitch Oauth //
app.post(apiBase+'twitch/token', (request, response) => {
    console.log('Starting Twitch token generator...');
    var tokenPath = twitch.tokenPathBuilder();
    console.log(request.body);
    
    var tokenRequest = https.request({ 
            method: 'POST',
            hostname: twitch.baseHostName, 
            path: tokenPath, 
            headers: { accept: 'application/vnd.twitchtv.v5+json' }
        }, 
        (res) => {
            res.on('data', (data) => {
                // response.set('Content-Type', 'text/html');
                response.send('SUCCESS');
                console.log(data);
                console.log('Received Token.');
            });
        }).on('error', (error) => {
            console.log(error);
        });
    
    //-- SHOUTOUT 73CN0109y: YOU DA BOMB --//
    tokenRequest.end();
});

// Twitch Oauth Success //
app.get(apiBase+'twitch/auth/success', (request, response) => {
    // Probs wont need //
    response.send({
        'message': 'SUCCESS',
        'token': 'SOMETOKEN',
        'id_token': 'SomeIDToken' 
    });
});