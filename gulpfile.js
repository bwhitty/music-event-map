/**
 * Gulp build file
 *
 * Based strongly off of http://stackoverflow.com/questions/28087674/gulp-browserify-6to5-source-maps
 * in order to get module loading, etc to work.
 **/

var gulp       = require('gulp');
var gutil      = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var babelify   = require('babelify');
var uglify     = require('gulp-uglify');
var glob       = require('glob');

var paths = {
    scripts: {
        src: 'js/**/*.js', // glob all js files for watch task
        build: 'build/js' // Compiled, minified, uglified source files
    }
};

// Task to compile scripts
// $ gulp scripts
gulp.task('scripts', function() {
    return browserify('./js/main.js', { debug: true })
        .add(require.resolve('babel/polyfill')) // adds Babel polyfill for better browser compat
        .transform(babelify)
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
            //.pipe(uglify({ mangle: false })) // uglify, don't mangle because it breaks things
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(paths.scripts.build));
});

// Task to watch and run anytime a file changes
// $ gulp watch
gulp.task('watch', function() {
    gulp.watch(paths.scripts.src, ['scripts']);
});

// Default task - starts up the watch task, then runs the scripts task
// $ gulp
gulp.task('default', ['watch', 'scripts']);