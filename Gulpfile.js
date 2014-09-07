var gulp = require('gulp')
        , uglify = require('gulp-uglify')
        , concat = require('gulp-concat');


gulp.task('default', function() {
        gulp.src([
            , './bower_components/angular/angular.js'
            , './bower_components/angular-animate/angular-animate.js'
            , './bower_components/angular-resource/angular-resource.js'
            , './bower_components/angular-route/angular-route.js'
            , './bower_components/ngprogress/build/ngprogress.js'
            , './bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
            , './js/app.js'
            ])
        .pipe(concat('build.min.js'))
        .pipe(uglify({
                mangle: false
            }))
        .pipe(gulp.dest('./js'));
});
