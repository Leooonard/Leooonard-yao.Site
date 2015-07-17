var gulp = require("gulp");
var less = require("gulp-less");
var path = require("path")

gulp.task("watch" , function(){
	gulp.watch("public/lesses/*.less" , function(){
		gulp.src("public/lesses/*.less").pipe(less({
      		paths: [ path.join(__dirname, 'less', 'includes') ]
    	})).pipe(gulp.dest("public/styles/"));
	})
});