const authBase = 'id.twitch.tv';
const scopes = 'user:read:email+openid';

module.exports = {
    authHostName: authBase,
    
    authPathBuilder: () => {
        return '/oauth2/authorize?client_id='+process.env.TWITCH_CLIENT_ID+'&redirect_uri='
        +process.env.TWITCH_REDIRECT_URI+'&response_type=token+id_token'+'&scope='+scopes
    }
}