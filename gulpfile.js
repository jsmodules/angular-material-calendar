var gulp = require("gulp"),
    scss = require("gulp-sass"),
    jade = require("gulp-jade"),
    minifyCSS = require("gulp-minify-css"),
    minifyHTML = require("gulp-minify-html"),
    autoprefixer = require("gulp-autoprefixer"),
    runSequence = require("run-sequence"),
    connect = require("gulp-connect"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify");

function p(path) {
    return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
}

gulp.task("uglify", function() {

    return gulp.src(p("js/angular-material-calendar"))
        .pipe(uglify())
        .pipe(gulp.dest("/"));

});

gulp.task("jade", function() {

    return gulp.src(p("src/jade/mdCalendar.jade"))
        .pipe(jade())
        .pipe(minifyHTML())
        .pipe(gulp.dest("/"));

});

gulp.task("scss", function() {

    return gulp.src(p("src/scss/angular-material-calendar.scss"))
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest("/"));

});