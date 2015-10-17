module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'bower:dev',
		'jst:dev',
		'jade:dev',
		'less:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
