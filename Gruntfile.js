/**
 * Grunt file: A build and assembly file for the machine.js project
 * @author Paul Daniell
 *
 *
 */

module.exports = function(grunt) {

    var srcFiles = [
        // Main File
        'src/Main.js',


        //Utils 
        'src/utils/ClassUtils.js',
        'src/utils/HashTable.js',
        'src/utils/HashSet.js',
        'src/utils/ANSI.js',
        'src/utils//StringUtils.js',

        // Classes
        'src/Alphabet.js',
        'src/BaseMachine.js',
        'src/Condition.js',
        'src/Command.js',
        'src/DFA.js',
        'src/FST.js',
        'src/DPDA.js',
        'src/TM.js',
        'src/Stack.js',
        'src/State.js',
        'src/StateTable.js',
        'src/Tape.js',
        'src/TransitionFunction.js'
    ];

    var testFiles = ['./test/**/*.js'];
    var testSuite = srcFiles.concat(testFiles);

    // Setup the config object
    var config = {

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dev: {
                src: srcFiles,
                dest: 'dist/machine-v<%= pkg.version %>.js'
            },

            production: {
                src: srcFiles,
                dest: 'machine.js'
            },

        },

        karma: {

            options: {


                // base path that will be used to resolve all patterns (eg. files, exclude)
                basePath: '',


                // frameworks to use
                // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
                frameworks: ['jasmine'],


                // list of files / patterns to load in the browser
                files: [],


                // list of files to exclude
                exclude: [],


                // preprocess matching files before serving them to the browser
                // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
                preprocessors: {},


                // test results reporter to use
                // possible values: 'dots', 'progress'
                // available reporters: https://npmjs.org/browse/keyword/karma-reporter
                reporters: ['progress'],


                // web server port
                port: 9876,


                // enable / disable colors in the output (reporters and logs)
                colors: true,


                // level of logging
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: 'INFO',


                // enable / disable watching file and executing tests whenever any file changes
                autoWatch: true,


                // start these browsers
                // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
                browsers: ['chromeIncognito'],

                // you can define custom flags
                customLaunchers: {
                    chromeIncognito: {
                        base: 'Chrome',
                        flags: ['--incognito']
                    }
                },


                // Continuous Integration mode
                // if true, Karma captures browsers, runs the tests and exits
                singleRun: false

            },

            dev: {
                options: {
                    files: testSuite,
                }
            },

            production: {
                options: {
                    files: [
                        '<%= concat.production.dest %>',
                        //'machine.js',
                        './test/**.js'
                    ],
                }

            }
        },

        clean: {
            build: ['dist/', 'docs/']
        },

        uglify: {

            options: {
                banner: '/*! <%= pkg.name %> (v<%= pkg.version %>) <%= grunt.template.today("dd-mmm-yyyy") %> */\n'
            },
            dev: {
                files: {
                    'dist/machine-v<%= pkg.version %>.min.js': '<%= concat.dev.dest %>'
                }

            },

            production: {
                files: {
                    'machine.min.js': '<%= concat.production.dest %>'
                }

            },
        },

        shell: {
            jsdocdev: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: './node_modules/.bin/jsdoc <%= concat.dev.dest %> ./README.md -d ./docs/dev '
            },

            jsdocproduction: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: './node_modules/.bin/jsdoc <%= concat.production.dest %> ./README.md -d ./docs/production'
            }
        }

    };


    // Register Tasks 
    grunt.registerTask('build-dev', 'Build the machine.js file from source for development.', ['clean', 'concat:dev', 'uglify:dev']);
    grunt.registerTask('build-production', 'Build the machine.js file for production.', ['clean', 'concat:production', 'uglify:production']);
    grunt.registerTask('docs-dev', 'Generate documentation for the development edition.', ['build-dev', 'shell:jsdocdev']);
    grunt.registerTask('docs-production', 'Generate documentation for the development edition.', ['build-production', 'shell:jsdocproduction']);
    grunt.registerTask('test-dev', 'Run tests for the development edition.', ['karma:dev']);
    grunt.registerTask('test-production', 'Run tests for the production edition.', ['build-production', 'karma:production']);

    // Initialize Grunt
    grunt.initConfig(config);

    // Load the dependent Tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-karma');
}