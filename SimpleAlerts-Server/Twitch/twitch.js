const authBase = 'https://id.twitch.tv/oauth2/authorize';
const scopes = 'user:read:email';

module.exports = {
    authBuilder: () => {
        return authBase+'?client_id='+process.env.TWITCH_CLIENT_ID+'&redirect_uri='
        +process.env.TWITCH_REDIRECT_URI+'&response_type=token+id_token'+'&scope='+scopes
    }
}