//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//

require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch.js');
const apiBase = '/api/v1/';
const https = require('https');
const app = express();

// PROPS TO: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue //
app.use(function (req, res, next) {

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
app.get(apiBase+'twitch/auth', (request, response) => {
    var authPath = twitch.authPathBuilder();
    console.log('Starting Twitch auth...');
    
    var oauthRequest = https.request({ 
            method: 'GET',
            hostname: twitch.authHostName, 
            path: authPath, 
            headers: { accept: 'application/vnd.twitchtv.v5+json' }
        }, 
        (res) => {
            res.on('data', (data) => {
                response.set('Content-Type', 'text/html');
                response.send(data);
                console.log('Sent Twitch Auth data.');
            });
        }).on('error', (error) => {
            console.log(error);
        });
    
    //-- SHOUTOUT 73CN0109y: YOU DA BOMB --//
    oauthRequest.end();
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