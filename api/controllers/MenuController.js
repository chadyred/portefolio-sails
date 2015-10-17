/**
 * MenuController
 *
 * @description :: Server-side logic for managing menus
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");

moment.locale('fr');

module.exports = {
	index: function (req, res) {

		Menu.find({}).populate('role').populate('itemWrapper').exec( function (err, results) {				
			
			//res.render('article/index', {articles : results});
			res.view('menu/index', {menus : results, moment: moment});
		});
	},
	new : function (req, res) {
		
		Item.find({}, function (err, results) {
			if(err) {
				console.error("Erreur de récupération des Items pour le menu", err);
			 	return err;
			} 
			else {
				res.view('menu/new', { items : results});
			}		
		});		
	},
	create: function (req, res) {
		console.error("Create URL lancée !");
		Menu.create({ titre : req.body.titre }, function (err, menu) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("Menu créé avec succès : " + menu.id);

				res.redirect("/menu/show/" + menu.id);
			}
		})
	},
	show: function (req, res) {
		console.error("Show URL lancée !");
		console.log("req.session.passport.user : " + req.session.passport);
		Menu.findOne(req.param('id')).populate('role').populate('items').exec(function (err, menu) {
			if (err) {
				console.error(" Erreur lors de la visualisation", err);
				return err;
			}
			else {
				console.log ("Le menu a été trouvé");
				res.view('menu/show', { menu : menu });

			}
		});
	},
	edit : function (req, res) {

		Menu.findOne(req.param('id'), function (err, menu) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("Le menu a été trouvé");

			}

			Item.find({}, function (err, results) {
				if(err) {
					console.error("Erreur de récupération des Items pour le menu", err);
				 	return err;
				} 
				else {
					console.log ("Les items du menu a édité ont été trouvés");					
				}

				res.view('menu/edit', { menu : menu, items : results});	
			});	
		});

		
	},
	update : function (req, res) {
		Menu.update({ id: req.params.id }, { titre: req.body.titre }).exec( function afterwards(err, results) {
			if(err) {
				console.error("Erreur update menu", err);
			 	return err;
			} 
			else {
				console.log("Mise-à-jour effectuées " + results[0].id);
				res.redirect('/menu/show/' + results[0].id);
			}
		});		
	},
	destroy : function (req, res) {
		//destroy retourne un tableau avec les élément supprimés ou un seul objet
		Menu.destroy({id: req.params.id}).exec(function (err, menu) {
			if(err) {
				console.error("Erreur de suppression du menu", err);
			 	return err;
			} 
			else {
				console.log("Suppression réussi - menus destroy : " + menu);
				res.redirect("/menu/index");
			}
		});		
	}
};

