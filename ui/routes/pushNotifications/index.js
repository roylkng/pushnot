var PushNotificationsModel = require('../models/PushNotification');
var C = require('../constants')

export.getPushNotificationsList = function (req, res, cache) {
	var projectId = req.query.projectId;
	PushNotificationsModel.find({projectId : projectId})
    					  .select({ type:1, title: 1});

  	query.exec(function (err, pushNotificationslist) {
        if (err) return next(err);
        res.send(pushNotificationslist);
    });
};
