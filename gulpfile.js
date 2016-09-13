/**
 * Gulp File
 *
 * @author: Rutger Laurman - lekkerduidelijk.nl
 * @url: https://github.com/lekkerduidelijk/sass-template
 *
 */

/* ==========================================================================
   Load dependencies
   ========================================================================== */
var gulp    = require('gulp'),
    del     = require('del'),
    plugins = require('gulp-load-plugins')(),
    pkg     = require('./package.json'),
    dirs    = pkg.settings.folders,
    run     = require('run-sequence');


/* ==========================================================================
   Options
   ========================================================================== */

var options = {

  default : {
    tasks : [ 'build', 'connect', 'watch' ]
  },

  build : {
    tasks: [ 'scss', 'js', 'icons', 'html', 'images', 'fonts' ]
  },

  icons : {
    file        : dirs.src  + '/assets/scss/icons.scss',
    folder      : dirs.src  + '/assets/icon',
    destination : dirs.dist + '/assets/css/'
  },

  js : {
    file        : dirs.src  + "/assets/js/app.js",
    files       : dirs.src  + "/assets/js/**/*.js",
    destination : dirs.dist + "/assets/js/"
  },

  scss : {
    file        : dirs.src  + "/assets/scss/style.scss",
    watchFiles  : dirs.src  + "/assets/scss/**/*.scss",
    files       : [dirs.src  + "/assets/scss/*.scss","!" + dirs.src  + "/assets/scss/icons.scss"],
    destination : dirs.dist + "/assets/css/"
  },
  //
  // copy : {
  //   files : [
  //     // Include all
  //     dirs.src + '/**',
  //
  //     // Exclude
  //     '!'+dirs.src +'/**/*.html',
  //     '!'+dirs.src +'/assets/scss/**',
  //     '!'+dirs.src +'/assets/scss',
  //     '!'+dirs.src +'/assets/js/**'
  //   ],
  //   destination: dirs.dist
  // },

  clean : {
    files: dirs.dist
  },

  connect : {
    port : 9000,
    base : 'http://localhost',
    root : 'build'
  },

  html : {
    files           : dirs.src + '/*.html',
    watchFiles      : dirs.src + '/**/*.html',
    file            : dirs.src + '/index.html',
    destination     : dirs.dist + '/',
    destinationFile : dirs.dist + '/index.html'
  },

  images : {
    files       : dirs.src + '/assets/img/*',
    destination : dirs.dist + '/assets/img'
  },

  fonts : {
    files       : dirs.src + '/assets/font/*',
    destination : dirs.dist + '/assets/font'
  },

  watch : {
    files : function() {
      return [
        options.html.watchFiles,
        options.js.files,
        options.scss.watchFiles
      ];
    },
    run : function() {
      return [
        [ 'html', 'images' ],
        [ 'js'],
        [ 'scss' ]
      ];
    }
  }


};


/* ==========================================================================
   Helper tasks
   ========================================================================== */

/* Clean
   ========================================================================== */

gulp.task('clean', function(){

  // Delete dist folder
  return del(options.clean.files);
});


/* Copy
   ========================================================================== */

// Copy
gulp.task('copy', function(){
  gulp.src(options.copy.files)

  // Notify on error
  .pipe(plugins.plumber({errorHandler: plugins.notify.onError("COPY: <%= error.message %>")}))

  .pipe(gulp.dest(options.copy.destination));

});

/* Connect
   ========================================================================== */

gulp.task( 'connect', function() {

  plugins.connect.server( {
    root       : [ options.connect.root ],
    port       : options.connect.port,
    base       : options.connect.base,
    livereload : true
  } );

});

/* Stylesheets
   ========================================================================== */

// Stylesheets
gulp.task('scss', function () {

  return gulp.src(options.scss.files)

    // Notify on error
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("SCSS: <%= error.message %>")}))

    // SASS
    .pipe(plugins.sass())

    // Autoprefixer
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename({suffix: '.uncompressed'}))

    // .pipe(plugins.rename('style.full.css'))
    .pipe(gulp.dest(options.scss.destination))

    // Minify
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename(function(opt) {
       opt.basename = opt.basename.replace(/\.uncompressed/, '');
       return opt;
     }))
    .pipe(gulp.dest(options.scss.destination))

    // Reload
    .pipe( plugins.connect.reload() )

    // Notify
    .pipe(plugins.notify("SCSS complete"));

});


/* Javascripts
   ========================================================================== */

gulp.task('js', function(){
  return gulp.src(options.js.file)

    // Notify on error
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("JS: <%= error.message %>")}))

    // Include files
    .pipe(plugins.include())
    .pipe(plugins.rename({suffix: '.combined'}))
    .pipe(gulp.dest(options.js.destination))

    // Uglify
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
       opt.basename = opt.basename.replace(/\.combined/, '.min');
       return opt;
     }))
    .pipe(gulp.dest(options.js.destination))

    // Reload
    .pipe( plugins.connect.reload() )

    // Notify
    .pipe(plugins.notify("JS complete"));

});


/* HTML
   ========================================================================== */

gulp.task('html', function(){
  return gulp.src(options.html.files)

    // Notify on error
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("HTML: <%= error.message %>")}))

    // Include files
    .pipe(plugins.include())
    .pipe(gulp.dest(options.html.destination))

    // Reload
    .pipe( plugins.connect.reload() )

    // Notify
    .pipe(plugins.notify("HTML complete"));

});

/* Images
   ========================================================================== */

gulp.task( 'images', function() {

  return gulp.src( options.images.files )

    // Notify on error
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("IMAGES: <%= error.message %>")}))

    // Minify images
    .pipe(plugins.imagemin())
    .pipe( gulp.dest( options.images.destination ) )

    // Reload
    .pipe( plugins.connect.reload() )

    // Notify
    .pipe(plugins.notify("IMAGES complete"));

});


/* Icons - not used
   ========================================================================== */

gulp.task( 'icons', function() {
  return gulp.src(options.icons.file)

    // Notify on error
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError("ICONS: <%= error.message %>")}))

    // SASS
    .pipe(plugins.sass())

    // Base64 inline SVG
    .pipe(plugins.cssBase64({
      // baseDir: options.icons.folder,
      // extensionsAllowed: ['svg'],
    }))
    .pipe(gulp.dest(options.icons.destination))

    // Minify
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename(function(opt) {
       opt.basename = opt.basename.replace(/\.uncompressed/, '');
       return opt;
     }))
    .pipe(gulp.dest(options.icons.destination))

    // Reload
    .pipe( plugins.connect.reload() )

    // Notify
    .pipe(plugins.notify("ICONS complete"));


});

/* Fonts
   ========================================================================== */

gulp.task( 'fonts', function() {

  return gulp.src( options.fonts.files )
    .pipe( gulp.dest( options.fonts.destination ) );

});


/* ==========================================================================
   Main tasks
   ========================================================================== */

/* Default
   ========================================================================== */

 gulp.task( 'default', options.default.tasks );


/* Build
   ========================================================================== */

gulp.task( 'build', function() {

   options.build.tasks.forEach( function( task ) {
     gulp.start( task );
   } );

});


/* Watch
   ========================================================================== */

gulp.task( 'watch', function() {

  var watchFiles = options.watch.files();

  watchFiles.forEach( function( files, index ) {
    gulp.watch( files, options.watch.run()[ index ]  );
  } );

});
