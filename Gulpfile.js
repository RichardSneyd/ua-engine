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

gulp.task('build', function () {
    build();
    return;
});

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
    };

    var b = watch ? watchify(browserifyInstance) : browserifyInstance;

    var build = function () {
        return b.bundle()
            .on("error", handleError)
            .pipe(source("uae.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist/"));
    }

    if (watch) {
		b.on("update", function() {
			gutil.log("Rebundling...");
			build();
		});
		b.on("log", function(e) {
			gutil.log("Bundling Successful: " + gutil.colors.gray(e));
		});
	}

	return build();
}

gulp.task("webserver", function () {
    gulp.src("./")
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task("browserify", function () {
    return build();
})

gulp.task("watch", function () {
  //  return gulp.watch('src/**/*.ts', gulp.series(['build', 'watch']));
  return build(true);
});

gulp.task('uglify', function () {
    return pipeline(
        gulp.src('lib/*.js'),
        uglify(),
        gulp.dest('lib')
    );
});

gulp.task('concat', function () {
    return gulp.src(['./lib/rise_h5_sdk_v1.0.js', './dist/uae.js'])
        .pipe(concat('uae.js'))
        .pipe(gulp.dest('./dist/'));
})

gulp.task("default", function () {
    return gulp.series('watch', 'concat');
});
