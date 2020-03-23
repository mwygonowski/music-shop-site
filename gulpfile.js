const gulp = require('gulp');
const sass = require('gulp-sass');
const  sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');

sass.compiler = require('node-sass');

function showError(err) {
    console.log('------------------------');
    console.log(err.messageFormatted);
    console.log('------------------------');

    notifier.notify({
        title: 'Błąd SCSS',
        message: err.messageFormated
    });
    this.emit("end");
}

const server = function(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    cb();
}


const css = function () {
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed" //compresed, expanded, nested, compact
        }).on('error', showError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
}


const watcher = function(cb){
    gulp.watch('./scss/**/*.scss',gulp.series(css));
    gulp.watch("./*.html").on('change', browserSync.reload);
    cb();
}


exports.css=css;
exports.watcher = watcher;
exports.default = gulp.parallel(server, css, watcher);

