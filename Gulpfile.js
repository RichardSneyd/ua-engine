var gulp = require("gulp"),
    webserver = require("gulp-webserver"),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    gutil = require("gulp-util"),
    tsify = require("tsify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pipeline = require('readable-stream').pipeline;

function handleError(error) {
    notify.onError({
        title: "Build Error!",
        message: "<%= error.message %>"
    })(error);

    this.emit("end");
}

function buildT() {
    return build();
}

function build(watch) {
    var browserifyInstance = browserify({
        entries: ['src/main.ts'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: watch
    }).plugin(tsify).transform("babelify", {
        presets: ['@babel/preset-env'],
        extensions: ['.ts']
    });

    var b = watch ? watchify(browserifyInstance) : browserifyInstance;

    var build = function () {
        return b.bundle()
            .on("error", handleError)
            .pipe(source("uae-pure.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/"));
    }

    if (watch) {
        b.on("update", function () {
            gutil.log("Rebundling...");
            build();
        });
        b.on("log", function (e) {
            gutil.log("Bundling Successful: " + gutil.colors.gray(e));
        });
    }

    return build();
}

function webserverT() {
    gulp.src("./")
        .pipe(webserver({
            livereload: true,
            open: true
        }));
}

function browserifyT() {
    return build();
}

function watchT() {
    //  return gulp.watch('src/**/*.ts', gulp.series(['build', 'watch']));
    return build(true);
}

function uglifyT() {
    return pipeline(
        gulp.src('lib/*.js'),
        uglify(),
        gulp.dest('lib')
    );
}

function concatT() {
    return gulp.src(['./lib/rise_h5_sdk_v1.0.js', './dist/uae-pure.js'])
        .pipe(concat('uae.js'))
        .pipe(gulp.dest('./dist/'));
}

function watchT2() {
    return gulp.watch('./dis/uae-pure.js', concatT);
};

//gulp.task("default", ['watch', 'concat']);
exports.default = gulp.series(watchT, watchT2);
