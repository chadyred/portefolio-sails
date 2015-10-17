module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {         
    	//Tous ce qui est dans vendor est copier dans .tmp/public
        dest: 'assets/vendor',
        options: {
          expand: true,
          //override le tableau .bower.json => main et permet de définir d'autre fichier.
	      packageSpecific: {
	      	//Bootstrap inclus le fichier bootstrap.less, selon bower c'est ce qu'il faut faire. 
	      	//Mieux vaut le dist tout près. S'il n'existe plus, il faut recompiler dans la tache grunt less 
	      	//l'ensemble du dossier "less" du dossier "bower_components/bootstrap"
	        bootstrap: {
	          files: [
	            "dist/css/bootstrap.min.css",
	            "dist/js/bootstrap.min.js",
	            "dist/fonts/*"
	          ]
	        }
	    }
      }
	}	
  });

  grunt.loadNpmTasks('grunt-bower');
};