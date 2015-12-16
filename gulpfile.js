/* eslint-env node */
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCSS = require("gulp-minify-css");
var htmlmin = require("gulp-htmlmin");
var autoprefixer = require("gulp-autoprefixer");
var runSequence = require("run-sequence");
var connect = require("gulp-connect");
var gfi = require("gulp-file-insert");
var uglify = require("gulp-uglify");
var eslint = require("gulp-eslint");
var size = require("gulp-size");
var replace = require("gulp-replace");
var protractor = require("gulp-protractor").protractor;
var Karma = require("karma").Server;
var rename = require("gulp-rename");

function p(path) {
    return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
}

gulp.task("js", function() {
    return gulp
        .src(p("src/angular-material-calendar.js"))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gfi({
            "/* angular-material-calendar.html */": p("dist/angular-material-calendar.html"),
            "/* angular-material-calendar.css */": p("dist/angular-material-calendar.min.css")
        }))
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest(""))
        .pipe(uglify())
        .pipe(size({ gzip: true, prettySize: true }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest(""));
});

gulp.task("html", function() {
    return gulp
        .src(p("src/angular-material-calendar.html"))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(replace("\"", "'"))
        .pipe(gulp.dest(p("dist")))
        .pipe(gulp.dest(""))
        .pipe(connect.reload());
});

gulp.task("js:lint", function() {
    return gulp
      .src(p("src/angular-material-calendar.js"))
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task("js:lint-ci", function() {
    return gulp
      .src(p("src/angular-material-calendar.js"))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

gulp.task("scss", function() {
    return gulp
        .src(p("src/**/*.scss"))
        .pipe(sass()).on("error", sass.logError)
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest(""))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest(""))
        .pipe(connect.reload());
});

gulp.task("karma:tdd", function(done) {
    new Karma({
        configFile: __dirname + "/karma.conf.js",
        singleRun: false
    }, done).start();
});

gulp.task("test", ["js:lint-ci"], function() {
    connect.server({ root: "website", port: 3000 });
    gulp
      .src(["./tests/e2e/**/*.spec.js"])
      .pipe(protractor({ configFile: p("protractor.conf.js") }))
      .on("error", function(e) { throw e; })
      .on("end", connect.serverClose);
});

gulp.task("build", function() {
    runSequence("scss", "html", "js");
});

gulp.task("connect", function() {
    connect.server({ livereload: true, root: "website", port: 3000 });
});

gulp.task("watch", function() {
    gulp.watch(p("src/**/*"), ["js:lint", "build"]);
});

gulp.task("default", ["karma:tdd", "connect", "watch"]);
