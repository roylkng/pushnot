exports.incrementCount = function(key, context, payload) {
  var EventStatsQueue = context.PushActionStatsQueue;
  var updateCommand = {"$inc" : {'count' : 1}};
 
  var op = {query: key, update: updateCommand};
  EventStatsQueue.add(JSON.parse(JSON.stringify(op)), function () {});
};

exports.updateChromePushNotificationActionCount = function (notificationId,
      actionType, projectId, currentHour, models, context) {
  var receivedAt = new Date();
  var currentDay = Math.floor( receivedAt.getTime() / (1000*60*60*24) );
	var key = {
		projectId: projectId,
		notificationId: notificationId,
		actionType: actionType,
		hour: currentHour,
	};
	exports.incrementCount(key, context);
};

exports.getChromeStatsCount = function (projectId, models, context, res) {
	var PushActionStats = models.PushActionStats;
  var query = PushActionStats.aggregate();
  var operator;
  operator = { $match: { "projectId" :String(projectId) } };
  query.append(operator);
  
  operator = {$group : { _id : {actionType : "$actionType" } , 
                    count : { $sum : "$count" } } };
  query.append(operator);
  console.log(query);
  query.exec(function(err, objects) {
    if (err){
  console.log(error);
    res.status(400).end(err);
    } else {
  console.log(objects);
    res.json(objects);
    }
  });
};