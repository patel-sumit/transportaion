var gulp = require('gulp'),
    concatify = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

gulp.task('copy', function () {
    gulp.src('src/*.*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concatify('app.js'))
        .pipe(gulp.dest('dist/js/'));
});
gulp.task('style', function () {
    gulp.src('src/css/*.css')
        .pipe(minifyCSS())
        .pipe(concatify('app.css'))
        .pipe(gulp.dest('dist/css/'));
});
gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['scripts']);
    
    gulp.watch('src/css/*.css', ['style']);
});
gulp.task('serve', function () {
    browserSync.init({
        server: './src'
    });
});
gulp.task('serve:dist', function () {
    browserSync.init({
        server: './dist'
    });
});

gulp.task('default', ['scripts', 'style', 'serve:dist']);

