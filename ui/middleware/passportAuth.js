var pbkdf2 = require('pbkdf2-sha256');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../lib/models/User');
var Project = require('../../lib/models/Project');
var ProjectCache = require('../../lib/cache/ProjectCache');
var crypto = require('crypto');
var validator = require('validator');

function _isValidPassword(key, string) {
  var parts = string.split('$');
  var iterations = parts[1];
  var salt = parts[2];
  return pbkdf2(key, new Buffer(salt), iterations, 32).toString('base64') === parts[3];
}

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, String(user.id));
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
        }, function (req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { 
            return done(err);
          }
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          }
          if (!_isValidPassword(password, user.password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
          }
          return done(null, user);
        });
      }
    ));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // checking if the website entered is valid
        var website = req.body.website;
        var phone = req.body.phone;
        if (!validator.isURL(website)) {
          return done(null, false, req.flash('signupMessage', 'Please enter a valid website.'));
        }
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ email :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            // check to see if theres already a user with that email
            if (user) {
              console.log(JSON.stringify(user));
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
              var query = User.find({websites: {$elemMatch: {$eq: website}}});
              query.exec(function (err, users) {
                if (err) {
                  return done(err);
                } else {
                  // check to see if theres already a user with that website
                  if (users && users.length>0) {
                    console.log(users);
                    return done(null, false, req.flash('signupMessage', 'That website is already registered. Please contact your adminstrator'));
                  } else {
                    var newUser = new User();
                    // set the user's credentials
                    newUser.username = email;
                    newUser.email = email;
                    newUser.websites = [website];
                    newUser.phone = phone;
                    newUser.isStaff = false;
                    storeEncryptedPassword(password, newUser, done);
                  }
                }
              });
            }
        });    
    }));
};

function storeEncryptedPassword (password, user, done) {
  var SALT_LENGTH = 12;
  var iterations = 10000;
  crypto.randomBytes(SALT_LENGTH, function (err, salt) {
    var pass = pbkdf2(password, new Buffer(salt).toString('base64'), iterations, 32);
    var passDB = 'pbkdf2_sha256$' + iterations + '$' + salt.toString('base64') + '$' + pass.toString('base64');
    user.password = passDB;
    // save the user
    user.save(function(err) {
      if (err) {
        throw err;
      } 
      else {
        saveProject(user, done);
      }
    });
  });
};

function makeWriteKey() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 16; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

function saveProject (user, done) {
  var project = new Project();
  project.owner = user._id;
  project.isActive = true;
  project.defaultLanguage = 'en';
  project.follower_emails = user.email;
  project.username = user.email;
  project.websites = user.websites.slice(0);
  project.properties = [{domain: user.websites.slice(0)}];
  project.writeKey = makeWriteKey();
  
  project.save(function (err, object) {
    if (err) {
      throw err; 
    } else {
      ProjectCache.updateCache(object);
      done(null, user);
    }    
  });
};
