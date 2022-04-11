'use strict';

module.exports = function(grunt) {

  const sass = require('node-sass');

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  grunt.initConfig({
    sass: {
      options: {
        implementation: sass
      },
      dist: {
        files: {
          'css/styles.css': 'css/styles.scss'
        }
      }
    },
    watch: {
      files: 'css/*.scss',
      tasks: ['sass']
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'css/*.css',
            '*.html',
            'js/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: './'
          }
        }
      }
    },
    copy: {
      html: {
        files: [{
          expand: true,
          dot: true,
          cwd: './',
          src: ['*.html'],
          dest: 'dist'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'node_modules/font-awesome',
          src: ['fonts/*.*'],
          dest: 'dist'
        }]
      }
    },
    clean: {
      build: {
        src: ['dist/']
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: './',
          src: ['img/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },
    useminPrepare: {
      foo: {
        dest: 'dist',
        src: ['contactus.html','aboutus.html','index.html']
      },
      options: {
        flow: {
          steps: {
            css: ['cssmin'],
            js: ['uglify']
          },
          post: {
            css: [{
              name: 'cssmin',
              createConfig: (context, block) => {
                let generated = context.options.generated;
                generated.options = {
                  keepSpecialComments: 0, rebase: false
                };
              }
            }]
          }
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {}
    },
    uglify: {
      dist: {}
    },
    cssmin: {
      dist: {}
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 20
      },
      release: {
        files: [{
          src: [
            'dist/js/*.js',
            'dist/css/*.css'
          ]
        }]
      }
    },
    usemin: {
      html: ['dist/contactus.html','dist/aboutus.html','dist/index.html'],
      options: {
        assetsDirs: ['dist', 'dist/css','dist/js']
      }
    },
    htmlmin: {                                         // Task
      dist: {                                        // Target
        options: {                                 // Target options
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'dist/index.html',  // 'destination': 'source'
          'dist/contactus.html': 'dist/contactus.html',
          'dist/aboutus.html': 'dist/aboutus.html',
        }
      }
    }
  });

  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', ['browserSync', 'watch']);
  grunt.registerTask('build', [
    'clean',
    'copy',
    'imagemin',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ])
}