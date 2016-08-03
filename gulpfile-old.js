/**
 * Gulp File
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @url: https://github.com/lekkerduidelijk/gulp-template
 *
 */

/* ==========================================================================
   Load dependencies
   ========================================================================== */
var gulp    = require('gulp'),
    del     = require('del'),
    plugins = require('gulp-load-plugins')(),
    pkg     = require('./package.json'),
    dirs    = pkg.settings.folders;

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

/* ==========================================================================
   Helper tasks
   ========================================================================== */

/* Clean
   ========================================================================== */

// Delete dist folder
gulp.task('clean', function(){
  return del([
    dirs.dist
  ]);
});


/* Copy
   ========================================================================== */

// Copy
gulp.task('copy', function(){
  gulp.src([
    // Include all
    dirs.src + '/**',

    // Exclude
    '!'+dirs.src +'/assets/scss/**',
    '!'+dirs.src +'/assets/scss',
    '!'+dirs.src +'/assets/js/**'

  ])

  // Notify on error
  .pipe(plugins.plumber({errorHandler: plugins.notify.onError("COPY: <%= error.message %>")}))

  .pipe(gulp.dest(dirs.dist));

});

/* Stylesheets
   ========================================================================== */

// Stylesheets
gulp.task('less', function () {
  return gulp.src(dirs.src + '/assets/less/style.less')

  // Notify on error
  .pipe(plugins.plumber({errorHandler: plugins.notify.onError("LESS: <%= error.message %>")}))

  // Less
  .pipe(plugins.less())

  // Autoprefixer
  .pipe(plugins.autoprefixer())
  .pipe(plugins.rename('style.full.css'))
  .pipe(gulp.dest(dirs.dist + '/assets/css/'))

  // Minify
  .pipe(plugins.cleanCss())
  .pipe(plugins.rename('style.css'))
  .pipe(gulp.dest(dirs.dist + '/assets/css/'))

  // Notify
  .pipe(plugins.notify("LESS complete"));

});


/* Javascripts
   ========================================================================== */

gulp.task('js', function(){
  return gulp.src(dirs.src +'/assets/js/app.js')

  // Notify on error
  .pipe(plugins.plumber({errorHandler: plugins.notify.onError("JS: <%= error.message %>")}))

  // Include files
  .pipe(plugins.include())
  .pipe(gulp.dest(dirs.dist + '/assets/js/'))

  // Uglify
  .pipe(plugins.uglify())
  .pipe(plugins.rename('app.min.js'))
  .pipe(gulp.dest(dirs.dist + '/assets/js/'))

  // Notify
  .pipe(plugins.notify("JS complete"));

});


/* Watch
   ========================================================================== */

gulp.task('watch', function () {
  gulp.watch(dirs.src + '/assets/js/**/*.js', ['js']);
  gulp.watch(dirs.src + '/assets/scss/**/*.scss', ['scss']);
  gulp.watch(dirs.src + '/*.html', ['build']);
  plugins.livereload.listen();
  gulp.watch(dirs.dist + '/**/*').on('change', plugins.livereload.changed);
});

/* ==========================================================================
   Main tasks
   ========================================================================== */

/* Default
   ========================================================================== */

gulp.task('default', function (done){
  runSequence('build', 'watch', done);
});

/* Build
   ========================================================================== */

gulp.task('build', function (done) {
    runSequence(
      'clean',
      'copy',
      ['less', 'js'],
      done);
});
