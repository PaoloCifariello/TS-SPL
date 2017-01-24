var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            module: "commonjs",
            noImplicitAny: false,
            target: 'es6'
        }))
        .pipe(gulp.dest('./build/'));
});