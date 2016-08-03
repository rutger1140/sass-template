// *************************************
//
//   Gulpfile
//
// *************************************
//
// Available tasks:
//   `gulp`
//   `gulp build`
//   `gulp compile:coffee`
//   `gulp compile:sass`
//   `gulp connect`
//   `gulp icons`
//   `gulp images`
//   `gulp lint:coffee`
//   `gulp lint:sass`
//   `gulp minify:css`
//   `gulp minify:js`
//   `gulp test:css`
//   `gulp test:js`
//
// *************************************

// -------------------------------------
//   Plugins
// -------------------------------------
//
// gulp              : The streaming build system
// gulp-autoprefixer : Prefix CSS
// gulp-coffee       : Compile CoffeeScript files
// gulp-coffeelint   : Lint your CoffeeScript
// gulp-concat       : Concatenate files
// gulp-connect      : Gulp plugin to run a webserver (with LiveReload)
// gulp-csscss       : CSS redundancy analyzer
// gulp-jshint       : JavaScript code quality tool
// gulp-load-plugins : Automatically load Gulp plugins
// gulp-minify-css   : Minify CSS
// gulp-parker       : Stylesheet analysis tool
// gulp-plumber      : Prevent pipe breaking from errors
// gulp-rename       : Rename files
// gulp-sass         : Compile Sass
// gulp-sass-lint    : Lint Sass
// gulp-svgmin       : Minify SVG files
// gulp-svgstore     : Combine SVG files into one
// gulp-uglify       : Minify JavaScript with UglifyJS
// gulp-util         : Utility functions
// gulp-watch        : Watch stream
// run-sequence      : Run a series of dependent Gulp tasks in order
//
// -------------------------------------

var gulp    = require( 'gulp' );
var run     = require( 'run-sequence' );
var plugins = require( 'gulp-load-plugins' )( {

  rename : {
    'gulp-minify-css' : 'cssmin',
    'gulp-sass-lint'  : 'sasslint'
  }

} );

var pkg     = require('./package.json');
var dirs    = pkg.settings.folders;

// -------------------------------------
//   Options
// -------------------------------------

var options = {

  // ----- Default ----- //

  default : {
    tasks : [ 'build', 'connect', 'watch' ]
  },

  // ----- Build ----- //

  build : {
    tasks       : [ 'compile:sass', 'compile:coffee', 'minify:css', 'minify:js', 'html' ],
    destination : dirs.dist
  },

  // ----- Clean ----- //

  clean : {
    files: dirs.dist
  },

  // ----- Coffee ----- //

  coffee : {
    files       : dirs.src + '/assets/coffee/*.coffee',
    file        : 'app.js',
    destination : dirs.dist +'/assets/js'
  },

  // ----- Connect ----- //

  connect : {
    port : 9000,
    base : 'http://localhost',
    root : 'build'
  },

  // ----- CSS ----- //

  css : {
    files       : dirs.dist + '/assets/css/*.css',
    file        : dirs.dist + '/assets/css/style.css',
    destination : dirs.dist + '/assets/css'
  },

  // ----- HTML ----- //

  html : {
    files           : dirs.src + '/*.html',
    file            : dirs.src + '/index.html',
    destination     : dirs.dist + '/',
    destinationFile : dirs.dist + '/index.html'
  },

  // ----- Icons ----- //

  icons : {
    files       : dirs.src + '/icon/icon-*.svg',
    destination : dirs.dist + '/build/icon'
  },

  // ----- Images ----- //

  images : {
    files       : dirs.src + '/assets/img',
    destination : dirs.dist + '/assets/img'
  },

  // ----- JavaScript ----- //

  js : {
    files       : dirs.dist + '/assets/js/*.js',
    file        : dirs.dist + '/assets/js/app.js',
    destination : dirs.dist + '/assets/js'
  },

  // ----- Sass ----- //

  sass : {
    files       : dirs.src + '/assets/scss/*.scss',
    destination : dirs.dist + '/assets/css'
  },

  // ----- Watch ----- //

  watch : {
    files : function() {
      return [
        options.html.files,
        options.coffee.files,
        options.sass.files
      ]
    },
    run : function() {
      return [
        [ 'html', 'images' ],
        [ 'compile:coffee', 'minify:js' ],
        [ 'compile:sass', 'minify:css' ]
      ]
    }
  }

};

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task( 'default', options.default.tasks );

// -------------------------------------
//   Task: Build
// -------------------------------------

gulp.task( 'build', function() {

  options.build.tasks.forEach( function( task ) {
    gulp.start( task );
  } );

});

// -------------------------------------
//   Task: Compile: Coffee
// -------------------------------------

gulp.task( 'compile:coffee', function() {

  gulp.src( options.coffee.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.coffee( { bare: true } ) )
    .pipe( plugins.concat( options.coffee.file ) )
    .pipe( gulp.dest( options.coffee.destination ) );

} );

// -------------------------------------
//   Task: Compile: Sass
// -------------------------------------

gulp.task( 'compile:sass', function () {

  gulp.src( options.sass.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.sass( { indentedSyntax: true } ) )
    .pipe( plugins.autoprefixer( {
            browsers : [ 'last 2 versions' ],
            cascade  : false
        } ) )
    .pipe( gulp.dest( options.sass.destination ) );

} );

// -------------------------------------
//   Task: Connect
// -------------------------------------

gulp.task( 'connect', function() {

  plugins.connect.server( {
    root       : [ options.connect.root ],
    port       : options.connect.port,
    base       : options.connect.base,
    livereload : true
  } );

});

// -------------------------------------
//   Task: HTML
// -------------------------------------

gulp.task( 'html', function() {

  gulp.src( options.html.files )
    .pipe( gulp.dest( options.html.destination ) )
    .pipe( plugins.connect.reload() );

});

// -------------------------------------
//   Task: Icons
// -------------------------------------

gulp.task( 'icons', function() {

  gulp.src( options.icons.files )
    .pipe( plugins.svgmin() )
    .pipe( plugins.svgstore( { inlineSvg: true } ) )
    .pipe( gulp.dest( options.icons.destination ) );

});

// -------------------------------------
//   Task: Images
// -------------------------------------

gulp.task( 'images', function() {

  gulp.src( options.images.files )
    .pipe( gulp.dest( options.images.destination ) )
    .pipe( plugins.connect.reload() );

});

// -------------------------------------
//   Task: Lint Coffee
// -------------------------------------

gulp.task( 'lint:coffee', function () {

  gulp.src( options.coffee.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.coffeelint() )
    .pipe( plugins.coffeelint.reporter() )

} );

// -------------------------------------
//   Task: Lint Sass
// -------------------------------------

gulp.task( 'lint:sass', function() {

  gulp.src( options.sass.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.sasslint() )
    .pipe( plugins.sasslint.format() )
    .pipe( plugins.sasslint.failOnError() );

} );

// -------------------------------------
//   Task: Minify: CSS
// -------------------------------------

gulp.task( 'minify:css', function () {

  gulp.src( options.css.file )
    .pipe( plugins.plumber() )
    .pipe (plugins.cleanCss() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( options.css.destination ) )
    .pipe( plugins.connect.reload() );

} );

// -------------------------------------
//   Task: Minify: JS
// -------------------------------------

gulp.task( 'minify:js', function () {

  gulp.src( options.js.file )
    .pipe( plugins.plumber() )
    .pipe( plugins.uglify() )
    .pipe( plugins.rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( options.js.destination ) )
    .pipe( plugins.connect.reload() );

} );

// -------------------------------------
//   Task: Test: CSS
// -------------------------------------

gulp.task( 'test:css', function() {

  gulp.src( options.css.file )
    .pipe( plugins.plumber() )
    .pipe( plugins.parker() );

  gulp.src( options.css.file )
    .pipe( plugins.plumber() )
    .pipe( plugins.csscss() );

});

// -------------------------------------
//   Task: Test: JS
// -------------------------------------

gulp.task( 'test:js', function() {

  gulp.src( options.js.file )
    .pipe( plugins.plumber() )
    .pipe( plugins.jshint() )
    .pipe( plugins.jshint.reporter( 'default' ) );

});

// -------------------------------------
//   Task: Watch
// -------------------------------------

gulp.task( 'watch', function() {

  var watchFiles = options.watch.files();

  watchFiles.forEach( function( files, index ) {
    gulp.watch( files, options.watch.run()[ index ]  );
  } );

});
