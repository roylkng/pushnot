/*
Client JS -- track events and request response from decision server
*/
var _connecto = _connecto || [];
// constants
/*
Client JS -- track events and request response from decision server
*/
// constants
_connecto.HTML5_PERMISSION_KEY = 'html5PermissionStatus';

// We have asked for html5 permission
_connecto.askedForHtml5Permission = false;
// We have tracked html5 response from user response to permission dialog
_connecto.trackedHtml5Response = false;
var objAgent = navigator.userAgent;
var objbrowserName = navigator.appName;
var objfullVersion = ''+parseFloat(navigator.appVersion);
var objBrMajorVersion = parseInt(navigator.appVersion,10);
var objOffsetVersion;
if ((objOffsetVersion=objAgent.indexOf("Chrome"))!=-1){ 
  objbrowserName = "Chrome";
  objfullVersion = objAgent.substring(objOffsetVersion+7);
}
objBrMajorVersion = parseInt(''+objfullVersion,10);
if (isNaN(objBrMajorVersion)){
  objfullVersion = ''+parseFloat(navigator.appVersion);
  objBrMajorVersion = parseInt(navigator.appVersion,10);
}

_connecto.getConnectoStorage = function() {
  var _Connecto = localStorage.getItem("_Connecto");
  if (_Connecto) {
    try {
      return JSON.parse(_Connecto);
    } catch(err) {
      return {};
    }
  }
  return null;
};

// initialize _connecto storage. It should be called only once
_connecto.initConnectoStorage = function() {
  if (!localStorage.getItem("_Connecto")) {
    var _Connecto = {
      "source":document.referrer,
      "landing_page":document.URL,
      "firstVisitOn":new Date()
    };
    localStorage.setItem("_Connecto", JSON.stringify(_Connecto));
    return _Connecto;
  } else {
    return _connecto.getConnectoStorage();
  }
};

// Saves or updates key/value pair to _connecto storage
_connecto.saveToConnectoStorage = function(key, value) {
  var _Connecto = _connecto.getConnectoStorage();
  if (!_Connecto) _Connecto = _connecto.initConnectoStorage();
  _Connecto[key] = value;

  localStorage.setItem("_Connecto", JSON.stringify(_Connecto));
};

// Gets value from _connecto storage for given key
_connecto.getFromConnectoStorage = function(key) {
  var _Connecto = _connecto.getConnectoStorage();
  if (_Connecto && _Connecto[key]) return _Connecto[key];
  else return null;
};

// Removes value from _connecto storage for given key
_connecto.removeFromConnectoStorage = function(key) {
  var _Connecto = _connecto.getConnectoStorage();
  if (_Connecto && _Connecto[key]) delete _Connecto[key];
  localStorage.setItem("_Connecto", JSON.stringify(_Connecto));
};

// If anonymousId is set in local storage, return it
// Else, handling creating new anonymousId on the server side
_connecto.getAnonymousId = function() {
  var anonymousId = _connecto.getFromConnectoStorage('anonymousId');
  return anonymousId;
};

// Common payload for all events
_connecto.getDefaultPayload = function(eventType, timestamp) {
  var anonymousId = _connecto.getAnonymousId();
  var userId = _connecto.getFromConnectoStorage('userId');
  var time = timestamp || new Date();

  var payload = {
    messageId: guid(),
    type: eventType,
    userId: userId,
    anonymousId: anonymousId,
    timestamp: time,
    context: {
      url: document.location.href,
      library : {
        name: 'connecto.js',
        version: '1.0',
      }
    },
    writeKey: _connecto.writeKey,
    channel: 'web',
  };

  return payload;
};

_connecto.ajax = function(options) {
  var url = options.url;
  var method = options.type || 'POST';
  var dataType = options.dataType || 'text/plain';
  var withCredentials = options.withCredentials || true;
  var callback = options.success;
  var data = options.data || null;
  var headers = options.headers;
  
  var req = new XMLHttpRequest();
  req.open(method, url, true);
  req.setRequestHeader('content-type', dataType);
  for (var key in headers) {
    req.setRequestHeader(key, headers[key]);
  }
  req.withCredentials = withCredentials;
  req.onreadystatechange = function() {
    if (callback && this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  if (data) {
    req.send(JSON.stringify(data));
  } else {
    req.send();
  }
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

_connecto._sendIdentifyToServer = function(userId, traits) {
  var userIdFromGetIdentify = _connecto.getIdentity();
  var updateTraits = _connecto._checkProfileTraits(traits);
  var sendIdentifyCallVar = true;
  if (userIdFromGetIdentify && userId && userId == userIdFromGetIdentify) {
    if (traits == undefined || !updateTraits) {
      sendIdentifyCallVar = false;
    }
  }
  return sendIdentifyCallVar;
};

_connecto._checkProfileTraits = function(traits) {
  var profileTraits = _connecto.getFromConnectoStorage('lastTraits');
  var updateTraits = false;
  if (JSON.stringify(traits) != JSON.stringify(profileTraits)) {
    updateTraits = true;
  }
  return updateTraits;
};

_connecto.identify = function(userId, traits, callback) {
  var timestamp = new Date();

  var sendIdentifyCallVar = _connecto._sendIdentifyToServer(userId, traits);
  if (!sendIdentifyCallVar) {
    if (callback) {
      callback();
    }
    return;
  }

  if (userId) {
    _connecto.saveToConnectoStorage('userId', userId);
  }
  _connecto.saveToConnectoStorage('lastTraits', traits);

  var payload = _connecto.getDefaultPayload('identify', timestamp);
  payload.traits = traits;
  var url = document.location.protocol + '//api.connecto.io/identify';
  if (document.location.hostname === 'localhost') {
    url = document.location.protocol + '//localhost:3000/identify';
  }
  if (payload.anonymousId!==null) {
    _connecto._sendAndProcessResponse(url, payload, callback);
  } else {
    _connecto._sendAndProcessResponse(url, payload, callback, _connecto.cbToSetAnonymousId);
  }
};

_connecto._sendAndProcessResponse = function(url, dict, cb, callbackToSetAnonymousId) {
  var callback = function(response) {
    res = JSON.parse(response);
    if (callbackToSetAnonymousId) {
      callbackToSetAnonymousId(res);
    }
    if (cb) {
      cb();
    }
  };

  dict.sentAt = new Date();
  _connecto.ajax({
    url : url,
    data: dict,
    success: callback
  });
};

_connecto.cbToSetAnonymousId = function(res) {
  if (res.anonymousId) {
    var anonymousId = res.anonymousId;
    _connecto.initConnectoStorage();
    _connecto.saveToConnectoStorage('anonymousId', anonymousId);
  }
};

_connecto.track = function(eventName, properties, callback) {
  var payload = _connecto.getDefaultPayload('track', new Date());
  payload.event = eventName;
  payload.properties = properties;

  var url = document.location.protocol + '//api.connecto.io/track';
  if (document.location.hostname === 'localhost') {
    url = document.location.protocol + '//localhost:3000/track';
  }
  if (payload.anonymousId!==null) {
    _connecto._sendAndProcessResponse(url, payload, callback);
  } else {
    _connecto._sendAndProcessResponse(url, payload, callback, _connecto.cbToSetAnonymousId);
  }
};

_connecto.page = function(data, callback) {
  var payload = _connecto.getDefaultPayload('page', new Date());

  if (data) {
    payload.data = data;
  }

  var url = document.location.protocol + '//api.connecto.io/javascripts/chrome_connecto.prod.min.js';
  if (document.location.hostname === 'localhost') {
    url = document.location.protocol + '//localhost:3000/javascripts/chrome_connecto.min.js';
  }
  if (payload.anonymousId!==null) {
    _connecto._sendAndProcessResponse(url, payload, callback);
  } else {
    _connecto._sendAndProcessResponse(url, payload, callback, _connecto.cbToSetAnonymousId);
  }
};

_connecto.onload = function(callback) {
  if (callback) {
    callback();
  }
};

_connecto.processOnLoad = function() {
  var functionCount = _connecto.length;
  for (var i=0; i < functionCount; i++) {
    _connecto._processPushedFunction(_connecto.shift());
  }
};

// Assuming array's first element is function name and rest are arguments
_connecto._processPushedFunction = function(pushedFunctionArray) {
  var method = pushedFunctionArray.shift();
  if (_connecto[method]) {
    _connecto[method].apply(null, pushedFunctionArray);
  }
};

_connecto.push = function(pushedFunctionArray) {
  _connecto._processPushedFunction(pushedFunctionArray);
};

_connecto.getIdentity = function() {
  var userId = _connecto.getFromConnectoStorage('userId');
  if (!userId) userId = _connecto.getAnonymousId();
  return userId;
};

_connecto.getUrlForUserAction = function (actionType) {

  var profileId = _connecto.getFromConnectoStorage('userId');

  var url = 'https://push.connecto.io/chromePush/track';
  if (document.location.hostname === 'localhost') {
    url = document.location.protocol + '//localhost:3000/chromePush/track';
  }
  url += '?writeKey=' + encodeURIComponent(_connecto.writeKey);
  url += '&actionType=' + encodeURIComponent(actionType);
  url += '&profileId=' + encodeURIComponent(profileId);

  return url;
};

_connecto.onPushSubscription = function(pushSubscription) {
  console.log('pushSubscriptionPackage = ', pushSubscription);

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached to the endpoint.
  if (pushSubscription.subscriptionId && pushSubscription.endpoint &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    mergedEndpoint = pushSubscription;
  }

  var savedEndpoint = _connecto.getFromConnectoStorage('pushSubscriptionEndpoint');

  if (savedEndpoint != mergedEndpoint) {
    _connecto.saveToConnectoStorage('pushSubscriptionEndpoint', mergedEndpoint);

    var anonymousId = _connecto.getAnonymousId();
    var userId = _connecto.getFromConnectoStorage('userId');
    if (!userId) userId = anonymousId;

    _connecto.identify(userId, {'$chromePushDetails' : JSON.stringify(pushSubscription)},
                       function() {
                         // Trigger a track for permission granted.
                         if(!_connecto.trackedHtml5Response) {
                           fetch(_connecto.getUrlForUserAction(2));
                           _connecto.trackedHtml5Response = true;
                         }
                       });
    // Also save status to the localstorage
    var html5Status = {status: Notification.permission, time: new Date()};
    _connecto.saveToConnectoStorage(_connecto.HTML5_PERMISSION_KEY, html5Status);
  }
};

_connecto.subscribeDevice = function() {
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {

    // We are about to ask for notification permission, we should count only
    // if current status was default. Else prompt won't show
    if (Notification.permission === 'default' && !_connecto.askedForHtml5Permission) {
      fetch(_connecto.getUrlForUserAction(1));
      _connecto.askedForHtml5Permission = true;
    }
    serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
      .then(_connecto.onPushSubscription)
      .catch(function(e) {
        // Check for a ` prompt issue
        console.log("Error while subscribing: " + e);
        if (Notification.permission === 'denied' && !_connecto.trackedHtml5Response) {
         fetch(_connecto.getUrlForUserAction(3));
          _connecto.trackedHtml5Response = true;
        }

        var html5Status = {status: Notification.permission, time: new Date()};
        _connecto.saveToConnectoStorage(_connecto.HTML5_PERMISSION_KEY, html5Status);
      });
  });
};

_connecto.pushForChrome = function(forceCallFlag) {
  navigator.serviceWorker.register('connecto_service_worker.js', {
    scope: '/'
  })
  .then(_connecto.subscribeDevice);
};

// Checks if push is supported on the browser
_connecto.isPushSupported = function() {
  if (!(navigator && navigator.serviceWorker)) {
    console.log('Service Workers not supported on this browser. Please upgrade to Chrome 50+');
    return false;
  }

  if (!(window.Notification)) {
    console.log('window.Notification not found.');
    return false;
  }

  if (!(window.PushManager || (navigator && navigator.push) )) {
    console.log('Pushmanager not found.');
    return false;
  }

  return true;
};

_connecto.initPushRegistration = function(forceCallFlag, callback) {
  if (_connecto.isPushSupported()){
    if (objbrowserName == 'Chrome' && objBrMajorVersion >= 50) {
      _connecto.pushForChrome(forceCallFlag);
    }
  }
  else {
    callback();
  }
};

(function() {
  if (!_connecto.initialized) {
    _connecto.initialized = true;
  } else {
    if (window.console && console.error) {
      console.error("Connecto Snippet Included Twice");
    }
    return;
  }
  _connecto.processOnLoad();
  var anonymousId = _connecto.getFromConnectoStorage('anonymousId');
  if (!anonymousId) {
    _connecto.initConnectoStorage();
  }
})();
