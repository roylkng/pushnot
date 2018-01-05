'use strict';

var _connectoSW = {
  version: 2,
  logging: true,
  writeKey: 'XXXXX',
  apiUrl: 'https://api.connecto.io',
  pushUrl: 'https://push.connecto.io'
};

importScripts(_connectoSW.pushUrl +
  '/javascripts/chrome_push/connecto_service_worker_library.js');
