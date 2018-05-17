var gulp = require('gulp');
var batch = require('gulp-batch');
var watch = require('gulp-watch');
var server = require('gulp-server-livereload');
var minify = require('gulp-minify');
//var livereload = require('gulp-livereload');


gulp.task("copy", function(){
	gulp.src("./holang.js").pipe(gulp.dest("./docs"))
})

gulp.task("build", function(){
  gulp.src("./docs/holang.js").pipe(minify({
    ext : {
        source : '.js',
        min : '.min.js'
      },
      mangle : false
    }))
  .pipe(gulp.dest("./dist"))
});

gulp.task('watch', function () {
  watch('./holang.js', batch(function (events, done) {
  	console.log("holang.js updated!!");
    gulp.start(['copy', 'build'], done);
  }));
});

gulp.task('www',['copy', 'watch'], function() {
  gulp.src("docs")
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});