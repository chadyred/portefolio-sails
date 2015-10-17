module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
    	'jade:dev',
		'jst:dev',
    	'bower:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
