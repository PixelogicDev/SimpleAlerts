//-- SHOUTOUT BallistyxStreams: YOU DA BOMB --//

require('dotenv').config();
const express = require('express');
const twitch = require('./twitch/twitch.js');
const apiBase = '/api/v1/';
const https = require('https');
const app = express();

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
            });
        }).on('error', (error) => {
            console.log(error);
        });
    
    //-- SHOUTOUT 73CN0109y: YOU DA BOMB --//
    oauthRequest.end();
});

// Twitch Oauth Success //
app.get(apiBase+'twitch/auth/success', (request, response) => {
    response.send("SUCCESS");
});