var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gcmq = require('gulp-group-css-media-queries');
var cssnano = require('gulp-cssnano');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');

var paths = {
  root: './',
  pages: {
    src: './*.html'
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './css'
  },
  scripts: {
    src: './src/js/**/*.js',
    dest: './js'
  }
}

var devWebpackConfig = {
  mode: 'development',
  entry:{
    home: './src/js/home.js',
    sub: './src/js/sub.js',
  },
  output:{
    filename: '[name].js'
  },
  module:{
    rules:[{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }]
  }
}

var prodWebpackConfig = {
  mode: 'production',
  entry:{
    home: './src/js/home.js',
    sub: './src/js/sub.js',
  },
  output:{
    filename: '[name].js'
  },
  module:{
    rules:[{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }]
  }
}

function watch() {
  gulp.watch(paths.styles.src, devStyles);
  gulp.watch(paths.scripts.src, devScripts);
}

function server() {
  browserSync.init({
    server: {
      baseDir: paths.root,
      directory: true
    }
  });
  browserSync.watch(paths.styles.src, browserSync.reload);
  browserSync.watch(paths.scripts.src, browserSync.reload);
  browserSync.watch(paths.pages.src, browserSync.reload);
}

function devStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
}

function prodStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(gulp.dest(paths.styles.dest))
}

function devScripts() {
  return gulp.src(paths.scripts.src)
  .pipe(gulpWebpack(devWebpackConfig, webpack))
  .pipe(gulp.dest(paths.scripts.dest))
}

function prodScripts() {
  return gulp.src(paths.scripts.src)
  .pipe(gulpWebpack(prodWebpackConfig, webpack))
  .pipe(gulp.dest(paths.scripts.dest))
}

exports.devStyles = devStyles;
exports.prodStyles = prodStyles;
exports.devScripts = devScripts;
exports.prodScripts = prodScripts;

gulp.task('dev', gulp.series(
  gulp.parallel(devStyles, devScripts),
  gulp.parallel(watch, server),
))

gulp.task('build', gulp.series(
  gulp.parallel(prodStyles, prodScripts),
))