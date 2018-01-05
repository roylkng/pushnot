'use strict';

var _connectoSW = _connectoSW || {};

_connectoSW.log = function(message) {
  if (_connectoSW.logging && console) {
    console.log(message);
  }
};

_connectoSW.getNotificationsActions = function(payload , number){
  var actions = [];
  if(number == 1){
    actions = [{action: 9, title: payload.actionButtonText1, icon: payload.imageUrl1}];    
  } else if(number == 2){
    actions = [{action: 9, title: payload.actionButtonText1, icon: payload.imageUrl1},
               {action: 10, title: payload.actionButtonText2, icon: payload.imageUrl2}];    
  }
  return actions;
}

_connectoSW.getNotificationsOptions = function(payload){
  var notification = {};
  notification.data = {};
  if (payload && payload.type) {
    notification.data.type =  payload.type || null;
    notification.body =  payload.message || null;
    notification.icon  = payload.icon || null;
    notification.data.targetUrl = payload.targetUrl || null;
    notification.data.defaultAction = 8;
    notification.vibrate  = payload.vibrate || null;
    notification.data.notificationId = payload.notificationId || null;
    notification.data.profileId = payload.profileId || null;
    notification.tag =  payload.notificationTag || null;
    if (payload.type == 3 || payload.type == '3'){
      notification.data.targetUrl1 = payload.targetUrl1 || null;
      notification.actions = _connectoSW.getNotificationsActions(payload, 1);
    }
    if (payload.type == 4 || payload.type == '4'){
      notification.data.targetUrl1 = payload.targetUrl1 || null;
      notification.data.targetUrl2 = payload.targetUrl2 || null;
      notification.actions = _connectoSW.getNotificationsActions(payload, 2);
    }
  }
  return notification;
}

_connectoSW.getUrlForUserAction = function (data, actionType, hasOptions) {

  var notificationId = data.notificationId || '';
  var profileId = data.profileId || '';

  var url = _connectoSW.pushUrl + '/chromePush/track';
  url += '?version=' + encodeURIComponent(_connectoSW.version);
  url += '&writeKey=' + encodeURIComponent(_connectoSW.writeKey);
  url += '&actionType=' + encodeURIComponent(actionType);
  url += '&notificationId=' + encodeURIComponent(notificationId);
  url += '&profileId=' + encodeURIComponent(profileId);

  return url;
};

self.addEventListener('install', function(event) {
  //Automatically take over the previous worker.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function() {
  _connectoSW.log('Activated Connecto ServiceWorker version:' +
    _connectoSW.version);
});

self.addEventListener('notificationclick', function(event) {
  _connectoSW.log('notificationclick listener', event);
  console.log(event);
  var action = 8;
  if (event.notification) {
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();
    _connectoSW.log("Closed Notification");
    if (event.notification.data) {
      _connectoSW.log("Redirecting to Target url");
      if(event.action && event.action == 9){
        var targetUrl = event.notification.data.targetUrl1 || null;
        action = event.action;
        if (targetUrl && clients) {
          clients.openWindow(targetUrl);
        }
      } else if(event.action && event.action == 10){
        var targetUrl = event.notification.data.targetUrl2 || null;
        action = event.action;
        if (targetUrl && clients) {
          clients.openWindow(targetUrl);
        }
      } else {
        var targetUrl = event.notification.data.targetUrl || null;
        if (targetUrl && clients) {
          clients.openWindow(targetUrl);
        }      
      }      
      fetch(_connectoSW.getUrlForUserAction(event.notification.data, action, false));
    }
  }
});

//Handle the push received event.
self.addEventListener('push', function(event) {
  if (event && event.data) {    
    var payload = event.data.json();
    fetch(_connectoSW.getUrlForUserAction(payload, 6, true));
    _connectoSW.log('Push Event Happened', event);

    // We need device id to query for notification details from connecto's server
    event.waitUntil(self.registration.showNotification(payload.title,
                                                      _connectoSW.getNotificationsOptions(payload))
    );
  }
});
