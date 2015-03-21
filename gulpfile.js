var gulp = require("gulp"),
    scss = require("gulp-sass"),
    jade = require("gulp-jade"),
    minifyCSS = require("gulp-minify-css"),
    minifyHTML = require("gulp-minify-html"),
    autoprefixer = require("gulp-autoprefixer"),
    runSequence = require("run-sequence"),
    replace = require("gulp-replace"),
    connect = require("gulp-connect"),
    jshint = require("gulp-jshint"),
    fs = require("fs"),
    uglify = require("gulp-uglify");

function p(path) {
    return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
}

gulp.task("js", function () {

    var template = fs.readFileSync(p("dist/mdCalendar.html"));

    return gulp.src(p("src/js/angular-material-calendar.js"))
        .pipe(replace("/* mdCalendar */", template.toString().replace(/"/gi, '\\"')))
        .pipe(uglify())
        .pipe(gulp.dest("dist"));

});

gulp.task("jade", function () {

    return gulp.src(p("src/jade/mdCalendar.jade"))
        .pipe(jade())
        .pipe(minifyHTML())
        .pipe(gulp.dest("dist"));

});

gulp.task("scss", function () {

    return gulp.src(p("src/scss/angular-material-calendar.scss"))
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest("dist"));

});

gulp.task("build", function () {
    runSequence("scss", "jade", "js");
});

gulp.task("connect", function () {
    connect.server({
        livereload: true,
        root: ''
    });
});

gulp.task("watch", function () {
    gulp.watch(p("src/scss/**/*.scss"), ["scss"]);
    gulp.watch(p("src/jade/**/*.jade"), function() {
        runSequence("jade", "js");
    });
    gulp.watch(p("src/js/**/*.js"), ["js"]);
});

gulp.task("default", ["build", "connect", "watch"]);