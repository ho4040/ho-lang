var gulp = require('gulp');
var batch = require('gulp-batch');
var watch = require('gulp-watch');
var server = require('gulp-server-livereload');
//var livereload = require('gulp-livereload');


gulp.task("copy", function(){
	gulp.src("./holang.js").pipe(gulp.dest("./www"))
})

gulp.task('watch', function () {
  watch('./holang.js', batch(function (events, done) {
  	console.log("holang.js updated!!");
    gulp.start(['copy'], done);
  }));
});

gulp.task('www',['copy', 'watch'], function() {
  gulp.src("www")
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});