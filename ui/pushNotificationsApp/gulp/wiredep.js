'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredepPushNotificationsApp', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/push-notifications.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: [/bootstrap-sass-official/, /bootstrap.js/],
    }))
    .pipe(gulp.dest('src'));
});