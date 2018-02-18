var gulp = require('gulp');
var server = require('gulp-server-livereload');

gulp.task("copy", function(){
	gulp.src("./holang.js").pipe(gulp.dest("./test"))
})

gulp.task('test',["copy"], function() {
  gulp.src('test')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});