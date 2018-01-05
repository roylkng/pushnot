/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
var E = require('../lib/constants');
var _getProcessName = function() {
  switch (process.env.NODE_ENV) {
    case (E.ENVIRONMENTS.PROD):
      return 'Events Server (Omnom)';
    default:
      return 'Development';
  }
};

var _getLicenseKey = function() {
  return '6688862509db8fddb2602cf7c4b67ed98ae4c2ab';
};

exports.config = {
   app_name: [_getProcessName()],
   /**
   * Your New Relic license key.
   */
   license_key: _getLicenseKey(),
   logging: {
     /**
      * Level at which to log. 'trace' is most useful to New Relic when diagnosing
      * issues with the agent, 'info' and higher will impose the least overhead on
      * production applications.
      */
     level: 'info',
     filepath: 'stderr'
   }
};
