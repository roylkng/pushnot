'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('pushNotificationsScripts', function () {
  return gulp.src('src/push-notificationsApp/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('pushNotificationsPartials', function () {
  return gulp.src(['src/push-notificationsApp/**/*.html'])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'pushNotificationsApp'
    }))
    .pipe(gulp.dest('.tmp/push-notificationsApp'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('pushNotificationsHtml', ['wiredepPushNotificationsApp', 'pushNotificationsScripts', 'pushNotificationsPartials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('src/push-notifications.html')
    .pipe($.inject(gulp.src('.tmp/push-notificationsApp/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    .pipe(assets = $.useref.assets())
    // .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    // .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('css_assets', function () {
  return gulp.src(['bower_components/chosen/chosen-sprite*.png',
                   'theme/plugins/iCheck/green*.png',
                   'theme/select2/select2.png'])
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size());
});

gulp.task('clean', function (done) {
  $.del(['.tmp', 'dist'], done);
});

// gulp.task('sync', function () {
//     var deferred = Q.defer();
//     // setTimeout could be any async task
//     setTimeout(function () {
//         deferred.resolve();
//     }, 1000);
//     return deferred.promise;
// });

// gulp.task('build', ['html',  'css_assets', 'images', 'data', 'fonts', 'misc'], function() {
//   // Need to do this sequentially, otherwise partials tend to get mixed up.
//   gulp.start('eventsHtml');
// });




gulp.task('build', ['pushNotificationsHtml', 'css_assets', 'fonts'], function() {
  // Need to do this sequentially, otherwise partials tend to get mixed up.
  // gulp.start('eventsHtml');
  // gulp.start('emailsHtml');
  // gulp.start('pushNotificationsHtml');
  // gulp.start('inappNotificationsHtml');
  // gulp.start('html5NotificationsHtml');
});
// gulp.task('build', ['html', 'css_assets', 'images', 'data', 'fonts', 'misc'], function() {
//   // Need to do this sequentially, otherwise partials tend to get mixed up.
//});
