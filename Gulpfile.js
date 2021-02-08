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
    pipeline = require('readable-stream').pipeline,
    shell = require('shelljs'),
    exec = require('child_process').exec;

// config object for tasks
const config = {
    calculateDeps: {
        src: ['src/Game/'],
        dest: 'src/Dep/ControlContainer.ts',
        //Maintain no space between commas!
        single: [
            'Loader',
            'GOFactory',
            'Loop',
            'LevelManager',
            'ScriptHandler',
            'Events',
            'AudioManager',
            'ImgLoader',
            'SndLoader',
            'AjaxLoader',
            'Screen',
            'PxGame',
            'PxFactory',
            'PxLoader',
            'HwFactory',
            'HwLoader',
            'HwPlayer',
            'Utils',
            'ActScripts',
            'Collections',
            'Colors',
            'Mixins',
            'Numbers',
            'Text',
            'Vectors',
            'GameConfig',
            'ScaleManager',
            'Game',
            'TweenManager',
            'LevelEditor',
            'EditorScene'
        ],
        ignore: [
            'UAENGINE',
            'BaseActivity',
            'BaseLevel',
            'BaseScene',
            'BaseMenu',
            'AbstractEventEmitter',
            'AbstractAppMain'
        ],
    },
    replaceAll: {
        files: ['dist/game.js'],
        replace: [['UAENGINE_1["default"]', 'window.UAENGINE']]
    },
    CopyPatches: {
        src: ['./patches/resource-loader.cjs.js'],
        dest: ['./node_modules/resource-loader/dist/resource-loader.cjs.js']
    },
    concat: {
        src: ['./lib/rise_h5_sdk_v1.0.js', './dist/uae-pure.js'],
        filename: 'uae.js',
        dest: 'dist/',
        watch: ['./dist/uae-pure.js']
    },
    browserify: {
        entries: [
            'src/main.ts'
        ],
        outfile: "uae.js",
        sourcemaps_dir: ".",
        out_dir: "dist/"
    },
    uglify: {
        src: 'dist/*.js',
        dest: 'dist/'
    }
}

function handleError(error) {
    console.log(error);

    this.emit("end");
}

function buildT() {
    return build();
}

function build(watch) {
    var browserifyInstance = browserify({
        entries: [config.browserify.entries],
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
            .pipe(source(config.browserify.outfile))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write(config.browserify.sourcemaps_dir))
            .pipe(gulp.dest(config.browserify.out_dir));
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
    return buildT();
}

function watchT() {
    //  return gulp.watch('src/**/*.ts', gulp.series(['build', 'watch']));
    
    return build(true);
}

function uglifyT() {

    return pipeline(
        gulp.src(config.uglify.src),
        uglify(),
        gulp.dest(config.uglify.dest)
    );
}

function concatT() {
    return gulp.src(config.concat.src)
        .pipe(concat(config.concat.filename))
        .pipe(gulp.dest(config.concat.dest));
}

function watchConcatT() {

    return gulp.watch(config.concat.watch, concatT);
};

function watchDecs() {
    return gulp.watch('src/Game/**/*.ts', genDecs);
}


function calculateDeps() {
    const CalculateDeps = require('./CalculateDeps.js');
    let calculateDeps = new CalculateDeps();

    let src = config.calculateDeps.src;
    let dest = config.calculateDeps.dest;
    let single = config.calculateDeps.single;
    let ignore = config.calculateDeps.ignore;
    
    return new Promise((resolve, reject)=>{      
        if(calculateDeps.refreshDeps(src, dest, single, ignore) == true){
            resolve('deps calculation finished!');
        }
        else {
            reject('something went wrong');
        }
    })
}

function genDecs(){
    return new Promise((resolve, reject) => {

        exec('sh typecompile.sh',
        (error, stdout, stderr) => {
            if(stdout){
                resolve('generated declarations');
            }
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });

       /*  
        if(shell.exec('./typecompile.sh')){
            resolve('generated declarations');
        } */
    });

}

function genDocs(){
    return new Promise((resolve, reject) => {

        exec('sh gendocs.sh',
        (error, stdout, stderr) => {
            if(stdout){
                resolve('generated documentation');
            }
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });
}

function copyPatches() {
    const CopyFiles = require('./CopyFiles.js');
    let cFiles = new CopyFiles();

    let src = config.CopyPatches.src;
    let dest = config.CopyPatches.dest;

    return new Promise((resolve, reject) => {
        if(cFiles.copy(src, dest)){
            resolve('copyPatches completed');
        }
    });
}

//exports.default = gulp.parallel(genDecs, watchDecs, gulp.series(gulp.parallel(copyPatches, calculateDeps), watchT));
exports.default = gulp.parallel(genDecs, watchDecs, gulp.series(gulp.parallel(copyPatches, calculateDeps), watchT));
exports.concat = concatT;
exports.uglify = uglifyT;
exports.browserify = browserifyT;
exports.webserver = webserverT;
exports.watchConcat = watchConcatT;
exports.calc = calculateDeps;
exports.genDecs = genDecs;
exports.watchDecs = watchDecs;
exports.watch = watchT;
exports.patch = copyPatches;
exports.docs = genDocs;