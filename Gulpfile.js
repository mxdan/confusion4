'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass')(require('node-sass')),
      browserSync = require('browser-sync'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      uglify = require('gulp-uglify'),
      usemin = require('gulp-usemin'),
      rev = require('gulp-rev'),
      cleanCss = require('gulp-clean-css'),
      flatmap = require('gulp-flatmap'),
      htmlmin = require('gulp-htmlmin');

function css(cb) {
  gulp.src('./css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./css'));
  cb();
}

function sassWatch(cb) {
  gulp.watch('./css/*.scss', css);
  cb();
}

function sync(cb) {
  let files = [
    './*.html',
    './css/*.css',
    './js/*.js',
    './img/*.{png,jpg,gif}'
  ]

  browserSync.init(files, {
    server: {
      baseDir: './'
    }
  });
  cb();
}

function clean() {
  return del(['dist']);
}

function copyfonts(cb) {
  gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
  .pipe(gulp.dest('./dist/fonts'));
  cb();
}

function imgmin(cb) {
  gulp.src('img/*.{jpg,png,gif}')
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  .pipe(gulp.dest('dist/img'));
  cb();
}

function useming() {
  return gulp.src('./*.html')
  .pipe(flatmap(function(stream, file) {
    return stream.pipe(usemin({
      css: [rev()],
      html: [ function() {
        return htmlmin({ collapseWhitespace: true })
      }],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ cleanCss(), 'concat' ]
    }))
  }))
  .pipe(gulp.dest('dist/'));
}

exports.build = gulp.series(clean, copyfonts, imgmin, useming);
exports.default = gulp.series(css, sync, sassWatch);
