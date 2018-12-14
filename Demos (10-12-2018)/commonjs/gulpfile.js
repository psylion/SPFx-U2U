const gulp = require('gulp'),
      tsc= require("gulp-typescript"),
      sourcemaps = require("gulp-sourcemaps"),
      merge = require('merge2');

const tsProject = tsc.createProject("tsconfig.json");

gulp.task("transpile", () => {
    const tsResult = tsProject.src()
                              .pipe(sourcemaps.init())
                              .pipe(tsProject());

    return merge([
        // Write the definition files
        //tsResult.dts.pipe(gulp.dest('definitions')),
        // Write the JS files
        tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('./dist'))
    ]);
});

gulp.task("watch", () => {
    gulp.watch("**/*.ts", ["transpile"]);
});