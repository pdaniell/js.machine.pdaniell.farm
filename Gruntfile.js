/**
 * Grunt file: A build and assembly file for the machine.js project
 * @author Paul Daniell
 *
 *
 */

module.exports = function(grunt) {

    var srcFiles = [
        'src/Main.js',

        'src/FiniteStateAutomaton.js',
        'src/State.js'
    ];


    // Setup the config object
    var config = {

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dev: {
                src: srcFiles,
                dest: 'dist/machine-v<%= pkg.version %>-dev.js'
            },

            production: {
                src: srcFiles,
                dest: 'machine.js'
            },

        },

        clean: {
            build: ['dist/*']
        },

        uglify: {

            options: {  
              	banner: '/*! <%= pkg.name %> (v<%= pkg.version %>)<%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dev: {
                files: {
                    'dist/machine-v<%= pkg.version %>-dev.min.js': '<%= concat.dev.dest %>'
                }

            },

            production: {
                files: {
                    'machine.min.js': '<%= concat.production.dest %>'
                }

            },
        }

    };


    // Register Tasks 
    grunt.registerTask('build-dev', 'Build the machine.js file from source for development.', ['clean', 'concat:dev', 'uglify:dev']);
    grunt.registerTask('build-production', 'Build the machine.js file for production.', ['clean', 'concat:production', 'uglify:production']);


    // Initialize Grunt
    grunt.initConfig(config);

    // Load the dependent Tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
}
