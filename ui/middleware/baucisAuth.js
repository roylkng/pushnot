/*
Here is the logic,
---
For guest users, do not allow any request
For admin users, allow all requests
For logged in users,
  // NOTE: website condition in GET/PUT/DELETE queries can only have a single
  //       website. i.e. get for website : {$in : [website1, website2]} will not work 
  - For GET requests,
    - if website is in req.baucis.conditions, make sure user is allowed to query for the website
    - if no website in req.baucis.conditions, add the list of websites user is allowed to query explicitly
  - For DELETE requests,
    - if website is in req.baucis.conditions, make sure user is allowed to query for the website
    - if no website in req.baucis.conditions, add the list of websites user is allowed to query explicitly
  - For PUT requests,
      - website property should be defined in the POST data and user should be allowed to manage that website
    AND
      - If website is in req.baucis.conditions, make sure user is allowed to query for the website
      - if no website in req.baucis.conditions, add the list of websites user is allowed to query explicitly
  - For POST requests,
    - website property should be defined in the POST data and user should be allowed to manage that website
*/
var logger = require('../logger').logger;
var util = require('util');

var ACCESS_LEVELS = {
  NONE : 'none',
  ALL : 'all',
  WEBSITE : 'website'
};

var ACCESS_POLICIES = {
  defaultPolicy : {
    guest : {
      read  : ACCESS_LEVELS.NONE,
      write : ACCESS_LEVELS.NONE
    },
    admin : {
      read  : ACCESS_LEVELS.ALL,
      write : ACCESS_LEVELS.ALL
    },
    user : {
      read  : ACCESS_LEVELS.WEBSITE,
      write : ACCESS_LEVELS.WEBSITE
    }
  },
  readOnlyToLoggedInUsers : {
    guest : {
      read  : ACCESS_LEVELS.NONE,
      write : ACCESS_LEVELS.NONE
    },
    admin : {
      read  : ACCESS_LEVELS.ALL,
      write : ACCESS_LEVELS.ALL
    },
    user : {
      read  : ACCESS_LEVELS.ALL,
      write : ACCESS_LEVELS.NONE
    }
  }
};

// This function checks if website passed in the conditions is valid (user has permissions)
// If website is passed and user has permission, it returns true
// If website is passed and user does not have permission, it returns false
// If website is not passed, it adds all websites to the list and returns true.
var checkValidWebsiteOrAdd = function(req, userWebsites) {
  if (req.baucis && req.baucis.conditions && req.baucis.conditions.website) {
    // Make sure websites in req.baucis.conditions is from valid list
    if (userWebsites.indexOf(req.baucis.conditions.website) != -1) {
      return true;
    }
  } else if (userWebsites) {
    // If no website in req.baucis.conditions, set websites in (list) query
    if (!req.baucis.conditions) req.baucis.conditions = {};
    req.baucis.conditions.website = {"$in" : userWebsites};
    return true;
  }
  return false;
};

// Returns true if req.body.website is defined and is in the list of userWebsites
var postDataHasValidWebsite = function(req, userWebsites) {
  if (req.body && req.body.website && userWebsites.indexOf(req.body.website) != -1) {
    return true;
  }
  return false;
};

baucisAuth = module.exports = function(policy) {
  return function(req, res, next) {

    if(!policy) policy = 'defaultPolicy';
    var isAuthorized = false;

    var user = 'user';
    if (!req.djangoSession || !req.djangoSession.profile) {
      user = 'guest';
    } else if (req.djangoSession.profile.is_admin_user) {
      user = 'admin';
    }

    var accessType = 'write';
    if (req.method === 'GET') accessType = 'read';

    if (req.method === 'OPTIONS') {
      // Always allow preflight request.
      isAuthorized = true;
    } else if (user && accessType) {
      if (ACCESS_POLICIES[policy] && ACCESS_POLICIES[policy][user] && ACCESS_POLICIES[policy][user][accessType]) {
        var accessLevel = ACCESS_POLICIES[policy][user][accessType];
        // For guest users, website level access is same as no access because there won't be any websites
        if (user === 'guest' && accessLevel === ACCESS_LEVELS.WEBSITE) {
          accessLevel = ACCESS_LEVELS.NONE;
        }
        if (accessLevel === ACCESS_LEVELS.ALL) {
          isAuthorized = true;
        } else if (accessLevel === ACCESS_LEVELS.NONE) {
          isAuthorized = false;
        } else if (accessLevel === ACCESS_LEVELS.WEBSITE) {
          // website specific logic ...
          var profileData = req.djangoSession.profile;
          var userWebsites = JSON.parse(profileData.websites);

          if (req.method === 'GET' || req.method === 'DELETE') {
            isAuthorized = checkValidWebsiteOrAdd(req, userWebsites);
          } else if (req.method === 'PUT') {
            if (postDataHasValidWebsite(req, userWebsites)) {
              isAuthorized = checkValidWebsiteOrAdd(req, userWebsites);
            }
          } else if (req.method === 'POST') {
            isAuthorized = postDataHasValidWebsite(req, userWebsites);
          } else if (req.method === 'OPTIONS') {
            isAuthorized = true;
          }
        }
      }
    }

    if (isAuthorized) {
      next();
    } else {
      // logger.error("Unauthorized Baucis Access " + util.inspect(req) + "\n");
      //res.status(401, "Unauthorized.").end();
      next();
    }
  };
};

