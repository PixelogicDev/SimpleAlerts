// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  envName: 'dev',
  baseServerPath: 'http://localhost:8000/',
  baseSimpleSocketPath: 'ws://127.0.0.1:8000',
  streamLabsAuthUrl:
    'https://www.streamlabs.com/api/v1.0/authorize' +
    '?client_id=3cHN5exsWXQhEaKKvTkcuFQTA70Besv08T5aWMjw' +
    '&redirect_uri=http://localhost:4200/dashboard' +
    '&response_type=code&scope=donations.read+socket.token'
};
