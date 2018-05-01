const Raven = require('raven');

module.exports = {
  instance: Raven,
  logException: error => {
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error);
    }
  }
};
