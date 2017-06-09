const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const uglify  = require('gulp-uglify');
const sass  = require('gulp-sass');
const rename  = require('gulp-rename');


gulp.task('sass', function () {

  return gulp.src('./pages/**/*.scss')
  	.pipe(changed('./pages/**/*.scss'))

    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename((path) => path.extname = '.wxss'))
    .pipe(gulp.dest('./pages'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./pages/**/*.scss', ['sass']);
});

gulp.task('default', ['sass:watch']);