var async = require('async');
var crypto = require('crypto');
var User = require('../../lib/models/User');
var E = require('../../lib/constants');
var Project = require('../../lib/models/Project');
var pbkdf2 = require('pbkdf2-sha256');
var contextDetails = require('./contextDetails');
var C = require('../../lib/constants');
var winston = require('winston');

exports.getForgotPage = function (req, res) {
  var flag1 = false, flag2 = false, flag3=false;
  var arr1 = req.flash('forgotMessage');
  if (arr1.length !== 0) {
    flag1 = true;
  }

  var arr2 = req.flash('infoMessage');
  if (arr2.length !== 0) {
    flag2 = true;
  }

  var arr3 = req.flash('errorMessage');
  if (arr3.length !== 0) {
    flag3 = true;
  }

  res.render('forgotPassword.handlebars', { message1: arr1, flag1: flag1,
                                            message2: arr2, flag2: flag2,
                                            message3: arr3, flag3: flag3 });
};

exports.postForgotPage = function(req, res, next, context) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: JSON.parse(JSON.stringify(req.body)).email },
       function(err, user) {
        if (!user) {
          req.flash('forgotMessage', 'No account with that email address exists.');
          return res.redirect('/forgot-password');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var mailer = context.mail;
      var email = JSON.parse(JSON.stringify(user)).email;
      var mailOptions = {
        from : 'contact@thoughtfabrics.com',
        to: email,
        subject: 'Connecto - Instructions to reset your password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      mailer.sendMail(mailOptions, function(err) {
        req.flash('infoMessage', 'An e-mail has been sent to ' + email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot-password');
  });
}; 

exports.getResetPassword = function(req, res) {
  console.log(req.params.token);
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      req.flash('errorMessage', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot-password');
    }
    var reqToken = JSON.parse(JSON.stringify(req.params)).token.toString();
    res.render('reset.handlebars', {
      'token': reqToken
    });
  });
};

exports.postResetPassword = function (req, res, context) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('errorMessage', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        var SALT_LENGTH = 12;
        var iterations = 10000;
        crypto.randomBytes(SALT_LENGTH, function (err, salt) {
          var pass = pbkdf2(req.body.password,
           new Buffer(salt).toString('base64'), iterations, 32);
          var passDB = 'pbkdf2_sha256$' + iterations + '$' +
           salt.toString('base64') + '$' + pass.toString('base64');
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.password = passDB;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });

      });
    },
    function(user, done) {
      var mailer = context.mail;
      var email = JSON.parse(JSON.stringify(user)).email;
      var mailOptions = {
        from : 'contact@thoughtfabrics.com',
        to: email,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
      };
      mailer.sendMail(mailOptions, function(err) {
        if (err) {
          console.log('Inside Err Mail '+ err);
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      console.log('Printing err'+ err);
    }
    res.redirect('/login');
  });
};

exports.getRegistrationPage = function (req, res) {
  var flag = false;
  var arr = req.flash('signupMessage');
  if (arr.length !== 0) {
    flag = true;
  }
  res.render('register', { message: arr,  'flag': flag});
};

exports.getLoginPage = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(exports.getDefaultAppUrl(req));
    return;
  }
  var flag = false;
  var arr = req.flash('loginMessage');
  if (arr.length !== 0) {
    flag = true;
  }
  res.render('login', {message:arr, 'flag': flag});
};

exports.logoutUser = function (req, res) {
  var name = 'User';
  if (req.user && req.user.username) {
    name = req.user.username;
  }
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
};

exports.getPushNotificationsAppSuffixes = function(req, res) {
  var routePath = req.originalUrl.split("\/");
  var extractedRoutePath = '/static/pushNotificationsDebugApp/src';
  for (var i = 2; i < routePath.length; i++) {
    extractedRoutePath += '/' + routePath[i];
  }
  console.log(extractedRoutePath);
  res.redirect(extractedRoutePath);
};

exports.switchUser = function (req, res, ProjectCache) {
  var routePath = req.originalUrl.split("\/");
  var userId = routePath[routePath.length - 1];
  var project = ProjectCache.findByOwnerId(req.user._id);
  var loggedInProject = project[0];

  if (loggedInProject) {
    var projectOutput = ProjectCache.findByOwnerId(userId);
    var newProject = projectOutput[0];
    if (newProject) {
      req.session.show_as_user = newProject._id;
    } else {
      req.session.show_as_user = loggedInProject._id;
    }
  }
  res.redirect(exports.getDefaultAppUrl(req));
};

exports.getPushNotifications = function(req, res) {
  res.render('push_notifications_app');
};

exports.getPushNotificationsDebug = function(req, res) {
  res.render('push_notifications_app_debug');
};

exports.getDefaultAppUrl = function(req) {
  return '/n/push_notifications';
};

exports.getNotificationContext = function(req, res, ProjectCache) {
  console.log('coming here');
  var context = {};
  context['user'] = {};
  context['allUsers'] = [];
  context['runningAsUser'] = {};
  context['projects'] = {};
  var userProfile = {};
  var userDetails = {};

  context['user']['id'] = req.user._id;
  context['user']['isAdmin'] = req.user.is_staff;
  context['user']['name'] = req.user.username;
  context['dburl'] = E.config.serverHostName + '/';
  context['serverConnectoUrl'] = E.config.serverHostName + '/';
  context['apiConnectoUrl'] = E.config.apiHostName + '/';
  context['pushHostUrl'] = E.config.pushHostName + '/';
  context['jobHostUrl'] = E.config.jobHostName + '/';
  context['tagElements'] = contextDetails.tagElements;
  context['tagMatchTypes'] = contextDetails.tagMatchTypes;
  context['supportedLanguages'] = contextDetails.supportedLanguages;
  context['jobTypes'] = contextDetails.jobTypes;
  context['jobStatus'] = contextDetails.jobStatus;
  context['sendTypes'] = contextDetails.sendTypes;

  var getManagedUsers = function(req) {

    var getContextDetails = function(project) {
      var email = [];
      if (project.follower_emails) {
        email = project.follower_emails.slice(0);
      }
      var websites = [];
      if (project.websites && project.websites.length>0) {
        websites = project.websites.slice(0);
      }

      context['user']['email'] = email;
      context['defaultLanguage'] = 'en';
      context['websites'] = websites;
      context['runningAsUser']['projectId'] = project._id;
      context['user']['isActive'] = project.isActive;

      User.findById(project.owner, function(err, userDetails) {
        if (err) {
          console.log(err);
          res.json(context);
        } else {
          context['runningAsUser']['id'] = userDetails._id;
          context['runningAsUser']['name'] = userDetails.username;
          context['user']['isStaff'] = false;
          if (userDetails.isStaff) {
            context['user']['isStaff'] = userDetails.isStaff;
          }
          context['projects'] = [project];
          res.json(context);
        }
      });
    };

    var loggedInProjectDetails = function (project) {
      if (req.session && req.session.show_as_user) {
        var newProject = ProjectCache.findById(req.session.show_as_user);
        if (newProject) {
          getContextDetails(newProject);
        } else {
          getContextDetails(project);
        }
      } else {
        getContextDetails(project);        
      }
    };

    var loopCount = 0;
    var getUserDetails = function (managedProjectId, length, project) {
      User.findById(managedProjectId, function(err, userDetails) {
        if (err) {
          console.log(err);
          loopCount++;
          if (loopCount === length) {
            loggedInProjectDetails(project);
          }
        }
        else {
          if (!userDetails) {
            console.log('No user object found for project id passed.');
            winston.error('No user object found for some project id passed.');
            loopCount++;
            if (loopCount === length) {
              loggedInProjectDetails(project);
            }
          }
          else {
            context['allUsers'].push({
              id: managedProjectId,
              name: userDetails.username
            });
            loopCount++;
            if (loopCount === length) {
              loggedInProjectDetails(project);
            }
          }
        }
      });    
    };

    var populateContext = function(projects, managedProjects, project) {
      if (Object.prototype.toString.call(projects) === '[object Array]') {
        managedProjects.push.apply(managedProjects, projects);
      } else {
        managedProjects.push(project);
      }

      for (var key = 0; key < managedProjects.length; key++) {
        //getUserDetails(managedProjects[key].owner, managedProjects.length, project);
        context['allUsers'].push({
          id: managedProjects[key].owner,
          name: managedProjects[key].username
        });
      }
      loggedInProjectDetails(project);
    };

    var projectOutput = ProjectCache.findByOwnerId(req.user._id);
    var project = projectOutput[0];
    if (project) {
      if (project.isActive === false) {
        console.log('The project is inActive for the User');
        res.json({});
      } else {
        var managedProjects = [];
        if (req.user.isStaff) {
          var projects = ProjectCache.getAllProjects();
          if (projects && projects.length>0) {
            populateContext(projects, managedProjects, project);
          } else {
            populateContext(project, managedProjects, project);
          }
        } else {
          populateContext(project, managedProjects, project);
        }
      }
    } else {
      console.log('No project found for the User in the Cache');
      res.json({});
    }
  };

  var managed_account_profiles = getManagedUsers(req);
};

exports.update = function(req, res, models, caches) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  caches.ProjectCache.load();
  res.sendStatus(200);
};
