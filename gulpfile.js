const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');

// Copy the html file into dist folder
function buildHtml() {
  return src('src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'));
}

// Optimize image file
function imageMin() {
  return src('src/images/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

// Minify JS
function compileJs() {
  return src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// Compile sass into minified css
function compileCss() {
  return src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss({ uglyComments: true }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// Watch for any src file changes
function livereload() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });

  watch('src/scss/**/*.scss', compileCss);
  watch('src/js/**/*.js', compileJs).on('change', browserSync.reload);
  watch('src/images/*', imageMin);
  watch('src/**/*.html', buildHtml).on('change', browserSync.reload);
}

exports.default = series(
  buildHtml,
  imageMin,
  compileJs,
  compileCss,
);

exports.watch = livereload;
