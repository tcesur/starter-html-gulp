var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
//========================================
//========================================
gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .on('error', function(err) {
    	console.log(err.toString());

    	this.emit('end');
    })
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});
gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
	});
});
gulp.task('useref', function() {
	return gulp.src('app/*.html')
        // Minifie seulement les fichiers CSS
        .pipe(gulpIf('*.css', minifyCSS()))
        // Minifie seulement les fichiers Javascript
        .pipe(gulpIf('*.js', uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
    });
gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(imagemin({
		interlaced: true
	}))
	.pipe(gulp.dest('dist/images'));
});
gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Met en cache les images passées par imagemin
        .pipe(cache(imagemin({
        	interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
    });
gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
});
gulp.task('clean:dist', function(callback) {
	del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback);
});
gulp.task('clean', function(callback) {
	del('dist');
	return cache.clearAll(callback);
});
//========================================
//========================================
gulp.task('build', function(callback) {
	runSequence(['sass', 'useref', 'images', 'fonts'],
		callback
		);
});
gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
		);
});