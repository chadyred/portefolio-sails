module.exports = {

		show: function (req, res) { 			
				Menu.find({}).populate('role').populate('items').exec(function (err, menus){
					if (err) {
						console.error(" Erreur lors récupération des menu dans le show article", err);
						return err;
					}
					else {
						Util.populateDeep('menu', menus, 'items.subMenu', function (err, newMenus) {
					        if (err) {
					            sails.log.error("ERR:", err);
					        }

							// console.error(" Article et menus récupéré avec succés", err);
							res.view('homepage', { menus : newMenus});	
					    });				
					}
			});
	},

}