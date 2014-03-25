var gulp = require('gulp');

var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var express = require('express');
var livereload = require('gulp-livereload');

gulp.task('compass', function() {
    gulp.src('./assets/css/*.scss')
        .pipe(compass({
            config_file: './compass/config.rb'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./assets/css/'))
        .pipe(livereload());
});

gulp.task('serve', function () {
    var app = express();
    app.use(express.static(__dirname));
    app.listen(1337);
});


gulp.task('watch', function () {
    gulp.watch(['./assets/css/*.scss'], ['compass']);
});

gulp.task('default', ['compass', 'serve', 'watch']);
