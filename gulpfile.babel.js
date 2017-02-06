// Based on Google's Web Starter Kit

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

// import browserify from 'browserify';
// import babelify from 'babelify';
// import vinylBuffer from 'vinyl-buffer'
// import vinylSourceStream from 'vinyl-source-stream'
import commonjs from 'rollup-plugin-commonjs';
import babelHelpers from 'babel-plugin-external-helpers';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import inject from 'rollup-plugin-inject';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(['source/assets/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

// Optimize images
gulp.task('images', () =>
  gulp.src('source/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size({title: 'images'}))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'source/*',
    '!source/*.html',
  ], {
    dot: true,
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'source/assets/styles/**/*.scss',
    'source/assets/styles/**/*.css',
  ])
    .pipe($.newer('.tmp/assets/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      includePaths: [
        path.join(__dirname, 'node_modules'),
      ],
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/assets/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(gulp.dest('.tmp/assets/styles'));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () => {

  const includePathOptions = {
    paths: ['source/scripts'],
  };

  const nodeResolveOptions = {
    browser: true,
    preferBuiltins: false,
  };

  const injectOptions = {
    include: '**/*.js',
    exclude: 'node_modules/**',
    jQuery: 'jquery',
  };

  // gulp.src([
    // Note: Since we are not using useref in the scripts build pipeline,
          // you need to explicitly list your scripts here in the right order
          // to be correctly concatenated
//
    // './source/assets/scripts/**/*.js',
    // Other scripts
  // ])

  return rollup({
      entry: './source/assets/scripts/main.js',
      format: 'iife',
      plugins: [
        inject(injectOptions),
        nodeResolve(nodeResolveOptions),
        commonjs(),
        babel({
          presets: [
            ["es2015", { "modules": false } ],
          ],
          exclude: 'node_modules/**',
          babelrc: false,
          plugins: [
            babelHelpers,
          ],
        }),
        includePaths(includePathOptions),

      ],
  })
  .pipe(source('main.js','./source/assets/scripts'))
  .pipe(gulp.dest('.tmp/assets/scripts'))

  .pipe(buffer())

  .pipe($.newer('.tmp/assets/scripts'))
  .pipe($.sourcemaps.init())
  .pipe($.babel())
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('.tmp/assets/scripts'))
  .pipe($.concat('main.min.js'))
  .pipe($.uglify({preserveComments: 'some'}))
  // Output files
  .pipe($.size({title: 'scripts'}))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('dist/assets/scripts'))
  .pipe(gulp.dest('.tmp/assets/scripts'))
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src(['source/**/*.html', '!source/partials/*.html'])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file',
     }))
    .pipe($.useref({
      searchPath: '{.tmp,source}',
      noAssets: true,
    }))
    .pipe(gulp.dest('.tmp/'))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: false,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
    })))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles', 'html'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'BS',
    // Allow scroll syncing across breakpoints
    // scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'source'],
    port: 3000,
  });

  gulp.watch(['source/**/*.html'], ['html'. reload]);
  gulp.watch(['source/assets/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['source/assets/scripts/**/*.js'], ['lint', 'scripts', reload]);
  // gulp.watch(['source/assets/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['source/assets/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'BS',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001,
  })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'html', 'scripts', 'images', 'copy'],
    cb
  )
);

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);
