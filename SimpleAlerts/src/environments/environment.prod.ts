export const environment = {
  production: true,
  envName: 'prod',
  baseServerPath: 'https://simple-alerts.herokuapp.com/',
  baseSimpleSocketPath: 'ws://simple-alerts.herokuapp.com',
  streamLabsAuthUrl:
    'https://www.streamlabs.com/api/v1.0/authorize' +
    '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
    '&redirect_uri=https://www.simplealerts.stream/dashboard' +
    '&response_type=code&scope=donations.read+socket.token'
};
