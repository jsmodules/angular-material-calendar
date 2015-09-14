var gulp = require("gulp");
var sass = require("gulp-sass");
var jade = require("gulp-jade");
var minifyCSS = require("gulp-minify-css");
var htmlmin = require("gulp-htmlmin");
var autoprefixer = require("gulp-autoprefixer");
var runSequence = require("run-sequence");
var connect = require("gulp-connect");
var jshint = require("gulp-jshint");
var gfi = require("gulp-file-insert");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var size = require("gulp-size");
var replace = require("gulp-replace");

function p(path) {
  return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
}

gulp.task("js", function() {
  return gulp
    .src(p("src/angular-material-calendar.js"))
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(gfi({
      "/* angular-material-calendar.html */": p("dist/angular-material-calendar.html"),
      "/* angular-material-calendar.css */": p("dist/angular-material-calendar.css")
    }))
    .pipe(uglify())
    .pipe(size({ gzip: true, prettySize: true }))
    .pipe(gulp.dest("dist"));
});

gulp.task("html", function() {
  return gulp
    .src(p("src/angular-material-calendar.html"))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(replace('"', "'"))
    .pipe(gulp.dest(p("dist")));
});

gulp.task("js:hint", function() {
  return gulp
    .src(p("src/angular-material-calendar.js"))
    .pipe(jshint())
    .pipe(jshint.reporter("fail"));
});

gulp.task("scss", function() {
  return gulp
    .src(p("src/**/*.scss"))
    .pipe(sass()).on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest("dist"));
});

gulp.task("build", function() {
  return runSequence(["scss"], "html", "js");
});

gulp.task("connect", function() {
  connect.server({ livereload: true, root: "" });
});

gulp.task("watch", function() {
  gulp.watch(p("src/**/*"), ["build"]);
});

gulp.task("default", ["build", "connect", "watch"]);
