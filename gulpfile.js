var env         = require('minimist')(process.argv.slice(2)),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    plumber     = require('gulp-plumber'),
    jade        = require('gulp-jade'),
    browserify  = require('gulp-browserify'),
    browserSync = require('browser-sync'),
    gulpif      = require('gulp-if'),
    stylus      = require('gulp-stylus'),
    csso        = require('gulp-csso'),
    concat      = require('gulp-concat'),
    prefixer    = require('autoprefixer-stylus'), 
    cache       = require('gulp-cache'),
    rsync       = require('rsyncwrapper');
    rupture     = require('rupture');

// Компиляция Jade
gulp.task('jade', function () {
    return gulp.src('app/src/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({pretty: !env.p}))
        .pipe(gulp.dest('app/dist/'));
});

// Компиляция Stylus
gulp.task('stylus', function(){
    return gulp.src('app/src/stylus/**/*.styl')
        .pipe(stylus({
          'include css': true,
          use:[
            rupture(),
            prefixer('last 10 versions')
          ]
    }))
        .pipe(gulp.dest('app/dist/css/'))
});

// Конкатинация vendors-js
gulp.task('vendors-js', function () {
    return gulp.src('app/src/vendors/*.js')
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('app/dist/vendors'));
});

// Конкатинация vendors-css
gulp.task('vendors-css', function () {
    return gulp.src('app/src/vendors/*.css')
        .pipe(plumber())
        .pipe(csso())
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest('app/dist/vendors'));
});

gulp.task('watch', function () {
    gulp.watch('app/src/jade/**/*.jade', ['jade']);
    gulp.watch('app/src/include/**/*.jade', ['jade']);
    gulp.watch('app/src/stylus/**/*.styl', ['stylus']);
    gulp.watch('app/dist/js/**/*.js', ['js']);
    gulp.watch('app/dist/js/**/*.js', [(env.fy) ? 'browserify' : 'js']);
    gulp.watch('app/dist/img/**/*.{jpg,jpeg,png,gif}');
});

gulp.task('browser-sync', function () {
    var files = [
       'app/dist/**/*.html',
       'app/dist/css/**/*.css',
       'app/dist/img/**/*',
       'app/dist/js/**/*.js',
    ];

    browserSync.init(files, {
        server: {
            baseDir: 'app/dist/',
        },
    });
});


// Дев
gulp.task('default', [(env.fy) ? 'browserify' : 'jade', 'vendors-js', 'vendors-css', 'watch', 'browser-sync']);