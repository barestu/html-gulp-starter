const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const fileinclude = require("gulp-file-include");
const concatCss = require("gulp-concat-css");
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

// Delete previous built file
function clean() {
  return del([
    'dist/assets/images',
    'dist/assets/fonts',
    'dist/**/*.html'
  ])
}

// Copy the html file into dist folder
function html() {
  return src("src/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("dist"));
}

// Bundle & uglify app js
function js() {
  return src("src/js/**/*.js")
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("dist/assets/js"))
    .pipe(browserSync.stream());
}

// Bundle & uglify js plugins
function jsPlugins() {
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "node_modules/owl.carousel/dist/owl.carousel.min.js",
    "node_modules/select2/dist/js/select2.min.js"
  ])
    .pipe(concat("plugins.js"))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("dist/assets/js"));
}

// Compile sass into minified css
function css() {
  return src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(uglifycss({ uglyComments: true }))
    .pipe(rename({ basename: 'styles', extname: ".min.css" }))
    .pipe(dest("dist/assets/css"))
    .pipe(browserSync.stream());
}

// Bundle & uglify css plugins
function cssPlugins() {
  return src([
    "node_modules/owl.carousel/dist/assets/owl.carousel.min.css",
    "node_modules/owl.carousel/dist/assets/owl.theme.default.min.css",
    "node_modules/select2/dist/css/select2.min.css"
  ])
    .pipe(concatCss('plugins.min.css'))
    .pipe(uglifycss({ uglyComments: true }))
    .pipe(dest("dist/assets/css"));
}

// Copy assets file to dist
function copyAssets() {
  return src("src/assets/**/*")
    .pipe(dest("dist/assets"));
}

// Watch for any src file changes
function livereload() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });

  watch("src/css/**/*.css", css);
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", js).on("change", browserSync.reload);
  watch("src/**/*.html", html).on("change", browserSync.reload);
  watch("src/assets/**/*", copyAssets);
}

exports.default = series(
  clean,
  html,
  parallel(js, css),
  parallel(jsPlugins, cssPlugins),
  copyAssets,
);

exports.watch = livereload;
