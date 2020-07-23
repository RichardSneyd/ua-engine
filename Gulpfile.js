var gulp = require("gulp"),
    webserver = require("gulp-webserver"),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    browserify = require("browserify"),
    tsify = require("tsify"),
    watchify = require("watchify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    gutil = require("gulp-util"),
    conc = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pipeline = require('readable-stream').pipeline;


function build(){
    var b = browserify({
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: watch
    }).plugin(tsify).transform("babelify", {
        presets: ['@babel/preset-env'],
            extensions: ['.ts']
    });

    b.bundle()
    .on("error", handleError)
    .pipe(source("src/main.ts"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("js/game/"));

}

gulp.task("webserver", function () {
    gulp.src("./")
    .pipe(webserver({
        livereload: true,
        open: true
    }));  
});

gulp.task("browserify", function(){
    this.build();
})

gulp.task("watch", function(){
    gulp.watch('src/**/*.ts', ['build', 'watch'])
});

gulp.task('uglify', function () {
    return pipeline(
          gulp.src('lib/*.js'),
          uglify(),
          gulp.dest('lib')
    );
  });

gulp.task('concat', function(){
    return gulp.src(['./lib/rise_h5_sdk_v1.0.js', './dist/uae.js'])
    .pipe(concat('uae.js'))
    .pipe(gulp.dest('./dist/'));
})

gulp.task("default", ["build", "watch", "concat", "webserver"]);
