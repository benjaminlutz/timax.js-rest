'use strict';

module.exports = function (grunt) {

    var watchFiles = {
        serverJS: ['Gruntfile.js', 'app.js', 'config.js', 'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js']
    };

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            serverJS: {
                files: watchFiles.serverJS,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },

        // configure jshint to validate js files
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },

            // when this task is run, lint the Gruntfile and all js files
            build: watchFiles.serverJS
        },

        // configure nodemon
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    watch: watchFiles.serverJS
                }
            }
        },

        // configure concurrent
        concurrent: {
            default: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true,
                limit: 10
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent:default']);

};
