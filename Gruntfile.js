/**
 * Grunt file: A build and assembly file for the machine.js project
 * @author Paul Daniell
 *
 *
 */

module.exports = function(grunt) {

	var srcFiles = ['src/Main.js', 'src/State.js'];

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
		}

	};



	grunt.registerTask('build', 'Build the machine.js file from source', ['clean', 'concat:dev']);

	grunt.


	grunt.initConfig(config);



	grunt.loadNpmTasks('grunt-contrib-concat');
  	grunt.loadNpmTasks('grunt-contrib-clean');
}