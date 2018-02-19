var gulp = require('gulp');
var batch = require('gulp-batch');
var watch = require('gulp-watch');
var server = require('gulp-server-livereload');
//var livereload = require('gulp-livereload');


gulp.task("copy", function(){
	gulp.src("./holang.js").pipe(gulp.dest("./test"))
})

gulp.task('watch', function () {
  watch('./holang.js', batch(function (events, done) {
  	console.log("holang.js updated!!");
    gulp.start(['copy'], done);
  }));
});

gulp.task('test',['copy', 'watch'], function() {
  gulp.src("test")
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});