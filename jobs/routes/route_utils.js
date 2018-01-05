var Q = require('q');
var C = require('../../lib/constants');

exports.updateRegistrationId = function (profileId, projectId,
                                         oldId, newId,
                                         context, callback) {
  var models = context.cassandraModels;
  var Profile = models.Profile;
  var query = {profileId: profileId, projectId: projectId};
  var updateValues = {};
  if (oldId && newId) {
    updateValues.android_devices = {'$add': [newId], '$remove': [oldId]};
  }
  else if (!newId && oldId) {
    updateValues.android_devices = {'$remove': [oldId]};
  }
  else {
    if (callback) {
      callback();
    }
    return;
  }
  Profile.update(query, updateValues, function (err) {
    if (err) {
      console.log('Error updating the registrationIds: '+err);
    } else {
      if (callback) {
        callback();
      }
    }
  });
};

exports.getRegistrationIdForProfiles = function (profileList, context) {
  var deferred = Q.defer();
  console.log("recived profileList of length" + profileList.length);
//   deferred.resolve({"RandomKaran":["APA91bFnu8cNyb0VIj-UIyb7oVIq3skXMG6GOBPXMt989nwqIwq66mYX2bAsF3qKKPFTHy95M5ztnTE8kuKFPmLvs7BoDAuDOK7haKqRNpkNaAJyf-7-f_r-YOf4pZnk29Osa1zRs5Gm"],
// "Random":["APA91bFnu8cNyb0VIj-UIyb7oVIq3skXMG6GOBPXMt989nwqIwq66mYX2bAsF3qKKPFTHy95M5ztnTE8kuKFPmLvs7BoDAuDOK7haKqRNpkNaAJyf-7-f_r-YOf4pZnk29Osa1zRs5Gm"]});
//   return deferred.promise;
  

	var models = context.cassandraModels;
	var Profile = models.Profile;
	var gcmIdsByProfile = {};
	var count = 0;
	for (var i=0; i<profileList.length; i++) {
    var query = {profileId: profileList[i].profileId, projectId: profileList[i].projectId};
    var queryOptions = {select: ['profileId as id','android_devices'], raw: true};
		Profile.find(query, queryOptions, function (err, profile) {
			if (err) {
        deferred.reject(err);
				console.log('Error fetching profile: '+err);
			} else {
        if (profile.length!==0) {
          gcmIdsByProfile[profile[0].id] = profile[0].android_devices;
        }
			}
			count++;
			if(count === profileList.length) {
        console.log("got the gcmIdsByProfile");
        deferred.resolve(gcmIdsByProfile);        
			}
		});
	}
  return deferred.promise;
};

exports.getRegistrationIdForProfile = function (profileId, projectId, context) {
  var deferred = Q.defer();
	var models = context.cassandraModels;
	var Profile = models.Profile;
  var gcmProfile = {};

  var query = {profileId: profileId, projectId: projectId};
  var queryOptions = {select: ['profileId as id','android_devices'], raw: true};
  Profile.find(query, queryOptions, function (err, profile) {
      if (err) {
        console.log('Error fetching profile: '+err);
        deferred.reject(err);
      } else {
        if (profile.length!==0) {
          gcmProfile[profile[0].id] = profile[0].android_devices;
        }
        deferred.resolve(gcmProfile);        
      }
  });
  return deferred.promise;
};

exports.getRegistrationIdForProject = function (projectId, context, callback) {
  var client = context.client;
  var query = 'SELECT "profileId", "android_devices" FROM profile WHERE "projectId"=? allow filtering';
  var params = [projectId];

  var errorCb = function (err) {
    if (err) {
      console.log('Error fetching profiles of projectId: '+projectId+', Error: '+err);
    }
  };

  client.eachRow(query, params, {autoPage: true}, function (n, row) {
    callback({profileId: row.profileId, regId: row.android_devices});
  }, errorCb);
};

exports.getChromeRegistrationIdForProfiles = function (profileList, context) {
  var deferred = Q.defer();
  console.log("recived profileList of length" + profileList.length);
  var models = context.cassandraModels;
  var Profile = models.Profile;
  var gcmIdsByProfile = {};
  var count = 0;
  for (var i=0; i<profileList.length; i++) {
    var query = {profileId: profileList[i].profileId, projectId: profileList[i].projectId};
    var queryOptions = {select: ['profileId as id','chrome_devices'], raw: true};
    Profile.find(query, queryOptions, function (err, profile) {
      if (err) {
        deferred.reject(err);
        console.log('Error fetching profile: '+err);
      } else {
        if (profile.length!==0) {
          gcmIdsByProfile[profile[0].id] = profile[0].chrome_devices;
        }
      }
      count++;
      if(count === profileList.length) {
  console.log("got the gcmIdsByProfile");
        deferred.resolve(gcmIdsByProfile);        
      }
    });
  }
  return deferred.promise;
};

exports.getChromeRegistrationIdForProfile = function (profileId, projectId, context) {
  var deferred = Q.defer();
  var models = context.cassandraModels;
  var Profile = models.Profile;
  var gcmProfile = {};

  var query = {profileId: profileId, projectId: projectId};
  var queryOptions = {select: ['profileId as id','chrome_devices'], raw: true};
  Profile.find(query, queryOptions, function (err, profile) {
      if (err) {
        console.log('Error fetching profile: '+err);
        deferred.reject(err);
      } else {
        if (profile.length!==0) {
          gcmProfile[profile[0].id] = profile[0].chrome_devices;
        }
        deferred.resolve(gcmProfile);        
      }
  });
  return deferred.promise;
};

exports.getChromeRegistrationIdsForProject = function (profileId, projectId, context) {
  var deferred = Q.defer();
  var models = context.cassandraModels;
  var Profile = models.Profile;
  var gcmProfile = {};

  var query = {profileId: profileId, projectId: projectId};
  var queryOptions = {select: ['profileId as id','chrome_devices'], raw: true};
  Profile.find(query, queryOptions, function (err, profile) {
      if (err) {
        console.log('Error fetching profile: '+err);
        deferred.reject(err);
      } else {
        if (profile.length!==0) {
          gcmProfile[profile[0].id] = profile[0].chrome_devices;
        }
        deferred.resolve(gcmProfile);        
      }
  });
  return deferred.promise;
};

exports.getChromeRegistrationIdForProject = function (projectId, propertyId, context) {
  var client = context.client;
  var deferred = Q.defer();
  var query = "SELECT \"profileId\", \"deviceDetails\" FROM all_devices WHERE \"projectId\"=? AND \"propertyId\"=? AND \"deviceType\"=2 allow filtering";
  var params = [projectId, propertyId];
  var profileData = [];

  var errorCb = function (err) {
    if (err) {
      deferred.reject(err);
      console.log('Error fetching profiles of projectId: '+projectId+', Error: '+err);
    }
  };

  console.log("querying db");
  console.log(query);
  console.log(params);
  console.log("querying db");

  client.eachRow(query, params, {autoPage: true}, function (n, row) {
    profileData.push({profileId: row.profileId, key: row.deviceDetails});
    // callback({profileId: row.profileId, regId: row.chrome_devices});
  }, function(err, result){
    if(profileData.length == 0){
      console.log("no profiledata found");
      deferred.reject("no profiledata found");
    } else{
      deferred.resolve(profileData);
    }
  });
  return deferred.promise;
};

exports.chunkifyArray = function (a, n, balanced) {
    if (n < 2) {
      return [a];
    }

    var len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(a.slice(i, i += size));
      }
    } else if (balanced) {
      while (i < len) {
          size = Math.ceil((len - i) / n--);
          out.push(a.slice(i, i += size));
      }
    } else {
      n--;
      size = Math.floor(len / n);
      if (len % size === 0) {
        size--;
      }
      while (i < size * n) {
        out.push(a.slice(i, i += size));
      }
      out.push(a.slice(size * n));
    }
    return out;
}

exports.random8DigitId = function() {
  return Math.floor(Math.random() * 90000000) + 1000000;
}

