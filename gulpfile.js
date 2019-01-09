"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var server = require("browser-sync").create();
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var del = require("del");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/*.js", gulp.series("gulp-uglify"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("gulp-uglify", function() {
  return gulp.src("source/js/*.js")
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
});

gulp.task("copy-font", function () {
  return gulp.src("source/fonts/**/*.{woff,woff2}", {base: "source"})
    .pipe(gulp.dest("build"))
});

gulp.task("copy-img", function () {
  return gulp.src("source/img/opt/**")
    .pipe(gulp.dest("build/img"))
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy-font",
  "copy-img",
  "css",
  "html",
  "gulp-uglify"
));

gulp.task("start", gulp.series("build", "server"));

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img/opt"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/opt/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img/opt"));
});
