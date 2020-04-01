module.exports = (grunt) => {
  grunt.initConfig({
    uglify: {
      options: {
        mangle: true,
        sourceMap: true,
        sourceMapIn: 'js/game/game.js.map',
        nameCache: 'uglifycache.db',
      },
      js: {
        files: {
          'js/game/game.min.js': ['js/game/game.js']
        }
      }
    },
    browserify: {
      main: {
        src: ['src/main.ts'],
        dest: 'js/game/game.js'
      },
      options: {
        cacheFile: 'cache.db',
        browserifyOptions: {
          debug: true
        },
        configure:  (bundler) => {
          bundler.plugin(require('tsify'));
          bundler.transform(require('babelify'), {
            presets: ['@babel/preset-env'],
            extensions: ['.ts']
          });
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          hostname: '*',
          onCreateServer: (server, connect, options) => {
            console.log("Listening on port 3000...");
          }
        }
      }
    },
    exorcise: {
      app: {
        options: {},
        files: {
          'js/game/game.js.map':['js/game/game.js'],
        }
      }
    },
    watch: {
      js: {
        files: ['src/**/*.ts'],
        //tasks: ['browserify', 'exorcise', 'uglify'],
        tasks: ['browserify', 'exorcise'],
      }
    },
    calculateDeps: {
      src: ['src/Game/'],
      dest: 'src/Dep/ControlContainer.ts',
      //Maintain no space between commas!
      single: ['Loader',
            'Events',
            'AudioManager',
            'ImgLoader',
            'SndLoader',
            'AjaxLoader',
            'Screen',
            'PxGame',
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
            'Vectors'],
      ignore: ['LineSegment', 'Polygon', 'Rect', 'Point', 'Circle']
    }
    /*
    notify: {
      js:{
        options:{
          title: "Build Created",
          message: "Build Successfully created",
          success: true,
          duration: 1
        }
      }
    }
    */

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exorcise');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-notify');


  grunt.registerTask('calculateDeps', 'Calculating dependencies', function() {
    const CalculateDeps = require('./CalculateDeps.js');
    let calculateDeps = new CalculateDeps();

    let src = grunt.config.data.calculateDeps.src;
    let dest = grunt.config.data.calculateDeps.dest;
    let single = grunt.config.data.calculateDeps.single;
    let ignore = grunt.config.data.calculateDeps.ignore;

    calculateDeps.refreshDeps(src, dest, single, ignore);
  });

  //grunt.registerTask('default', ['connect', 'browserify', 'exorcise', 'uglify', 'watch']);
  grunt.registerTask('default', ['calculateDeps', 'connect', 'browserify', 'exorcise', 'watch']);
}

