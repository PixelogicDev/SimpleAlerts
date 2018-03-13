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
    var authUri = twitch.authBuilder();
    console.log('Starting Twitch auth...');
    
    https.request({ 
            method: 'get', 
            path: authUri, 
            headers: {accept: 'application/vnd.twitchtv.v5+json'
        },  
        res => {
        
        }        
    });
    
    https.get(authUri, result => {
        result.on('data', (data) => {
            response.set('Content-Type', 'text/html');
            response.send(data);
        });
    });
});

// Twitch Oauth Success //
app.get(apiBase+'/twitch/auth/success', (request, response) => {
    response.send("SUCCESS");
});