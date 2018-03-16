module.exports = {
    baseHostName: 'id.twitch.tv',
    
    tokenPathBuilder: (code) => {
        return 
            `/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}`+
            `&client_secret=${process.env.TWITCH_SECRET}`+
            `&code=${code}`+
            `&grant_type=authorization_code`+
            `&redirect_uri=${process.env.TWITCH_REDIRECT_URI}`;
    }
}