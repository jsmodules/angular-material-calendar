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
var wiredep = require('wiredep');
var plugins = require('gulp-load-plugins')();

// helper vars for font end build
var js_src = ['dist/angular-material-calendar.js', 'site_src/js/*.js'];
var css_src = ['site_src/css/*.css'];

function p(path) {
    return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
}

function processHtml(path) {
    return gulp.src(path)
        .pipe(wiredep.stream({
            fileTypes: {
                html: {
                    replace: {
                        js: function (filePath) {
                            return '<script src="' + '/js/' + filePath.split('/').pop() + '"></script>';
                        },
                        css: function (filePath) {
                            return '<link rel="stylesheet" href="' + '/css/' + filePath.split('/').pop() + '"/>';
                        }
                    }
                }
            }
        }))

        .pipe(plugins.inject(
            // Just reference the non-minified version of our code
            gulp.src(js_src, { read: true }), {
                addRootSlash: false,
                transform: function (filePath, file, i, length) {
                    if (filePath.indexOf('dist/') > -1) {
                        return '<script src="' + filePath.replace('dist', '/js') + '"></script>';
                    }
                    return '<script src="' + filePath.replace('site_src', '') + '"></script>';
                }
            }))

        .pipe(plugins.inject(
            // No need to include dist here as the CSS is embedded in the js
            gulp.src(css_src, { read: false }), {
                addRootSlash: false,
                transform: function (filePath, file, i, length) {
                    return '<link rel="stylesheet" href="' + filePath.replace('site_src', '') + '"/>';
                }
            }))
        // .pipe(concat('index.html')) // this is to let us control the name of the output file
        .pipe(gulp.dest('website'));
}

gulp.task('vendor-scripts', function () {
    return gulp.src(wiredep().js.concat(js_src))
        .pipe(gulp.dest('website/js'));
});

gulp.task('vendor-css', function () {
    return gulp.src(wiredep().css.concat(css_src))
        .pipe(gulp.dest('website/css'));
});

gulp.task('index', ['scss', 'html', 'js', 'vendor-scripts', 'vendor-css'], function () {
    processHtml('site_src/index.html');
    processHtml('site_src/fullscreen.html');
    processHtml('site_src/404.html');
});

gulp.task("js", function () {
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

gulp.task("html", function () {
    return gulp
        .src(p("src/angular-material-calendar.html"))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(replace("\"", "'"))
        .pipe(gulp.dest(p("dist")))
        .pipe(gulp.dest(""))
        .pipe(connect.reload());
});

gulp.task("js:lint", function () {
    return gulp
        .src(p("src/angular-material-calendar.js"))
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("js:lint-ci", function () {
    return gulp
        .src(p("src/angular-material-calendar.js"))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task("scss", function () {
    return gulp
        .src(p("src/**/*.scss"))
        .pipe(sass()).on("error", sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
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

gulp.task("karma:tdd", function (done) {
    new Karma({
        configFile: __dirname + "/karma.conf.js",
        singleRun: false
    }, done).start();
});

gulp.task("test", ["js:lint-ci"], function () {
    connect.server({ root: "website", port: 3000 });
    gulp
        .src(["./tests/e2e/**/*.spec.js"])
        .pipe(protractor({ configFile: p("protractor.conf.js") }))
        .on("error", function (e) { throw e; })
        .on("end", connect.serverClose);
});

gulp.task("build", function () {
    runSequence('index');
});

gulp.task("connect", function () {
    connect.server({ livereload: true, root: "website", port: 3000 });
});

gulp.task("watch", function () {
    gulp.watch([p("src/**/*"),p("site_src/**/*")], ["js:lint", "build"]);
});
// build first for the case where
// the developer has been hacking before starting the server
gulp.task("default", ["build", "karma:tdd", "connect", "watch"]);
