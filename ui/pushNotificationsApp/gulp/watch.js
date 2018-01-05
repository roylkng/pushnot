'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep'] ,function () {
  gulp.watch('src/push-notificationsApp/**/*.js', ['scripts']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
