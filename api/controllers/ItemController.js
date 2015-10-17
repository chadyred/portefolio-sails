/**
 * ItemsController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");

moment.locale('fr');

module.exports = {
	index: function (req, res) {

		Item.find({}).populate('menu').populate('subMenu').exec(function (err, results) {				
			
			//res.render('article/index', {articles : results});
			res.view('item/index', {items : results, moment: moment});
		});
	},
	new : function (req, res) {

		Menu.find({}, function (err, results) {
			if(err) {
				console.error("Erreur de récupération des Menus pour l'item", err);
			 	return err;
			} 
			else {
				res.view('item/new', { menus : results});
			}		
		});		
	},
	create: function (req, res) {
		console.error("Create URL lancée !");

		if(req.body.menu === "-1")
			req.body.menu = null;

		if(req.body.submenu === "-1")
			req.body.submenu = null;

		Item.create({ titre : req.body.titre, menu: req.body.menu, submenu: req.body.submenu }, function (err, item) {
			if (err) {
				console.error("Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("Item créé avec succès : " + item.id);

				res.redirect("/item/show/" + item.id);
			}
		})
	},
	show: function (req, res) {
		console.error("Show URL lancée !");
		console.log("req.session.passport.user : " + req.session.passport);
		Item.findOne(req.param('id')).populate('menu').exec(function (err, item) {
			if (err) {
				console.error(" Erreur lors de la visualisation", err);
				return err;
			}
			else {
				console.log ("L'item a été trouvé");
				res.view('item/show', { item : item });

			}
		});
	},
	edit : function (req, res) {
		Item.findOne(req.param('id')).populate('subMenu').exec(function (err, item) {
			if (err) {
				console.error(" Erreur lors de la création de l'item", err);
				return err;
			}
			else {
				console.log ("L'item a été trouvé");

			}

			Menu.find({}, function (err, results) {
				if(err) {
					console.error("Erreur de récupération des Menus pour l'item", err);
				 	return err;
				} 
				else {
					console.log ("Les menus nécessaire à l'édition d'un item sont récupérés");
				}

				res.view('item/edit', { item : item, menus : results});	
			});	
		});

		
	},
	update : function (req, res) {

		console.log("typeof req.body.menu" + typeof req.body.menu);

		if(req.body.menu === "-1")
			req.body.menu = null;

		if(req.body.submenu === "-1")
			req.body.submenu = null;

		//On met à null l'item qui a le sousmenu de notre item
		Menu.findOne(req.body.submenu, function (err, result) {
			if(err) {
				console.error("Menu pas trouvé erreur", err);
				return err;
			}
			else {
				console.error("Menu trouvé que possédé ce rôle");

				if(typeof result !== "undefined"){

					Item.update({subMenu: result.id}, {subMenu: null}).exec(function (err, subMenuPrev) {
						if(err) {
							console.error("Erreur lors de la mise à jour du subMenu qui contient le menu précédent", err);
							return err;
						}
						else {
							console.log("Succès d'update du subMenu possédant le menu ayant notre rôle précédemment : " + subMenuPrev);
						}
					});
				}
			}
		});

		//ensuite on enregistre notre item
		Item.update({ id: req.params.id }, {titre: req.body.titre, menu: req.body.menu, subMenu: req.body.submenu }).exec( function afterwards(err, results) {
			if(err) {
				console.error("Erreur update item", err);
			 	return err;
			} 
			else {
				console.log("Mise-à-jour effectuées !" + results[0].id);

				//Puis on met à null l'item conteneur sur lequel pointe le menu AVANT de mettre l'item
				Menu.update({itemWrapper: results[0].id}, {itemWrapper: null}).exec( function (err, result) {
					if(err) {
						console.error("Erreur d'update du menu lié à l'item", err);
						return err;
					}
					else {
						console.log("Succès d'update du menu que contient l'item : " + result);
						//Le rôle du menu précédent peut être différent de celui actuel
						
					}
				});

				//Si le subMenu vaut null, inutile de mettre à jour...une valeur NULL sinon on met cette item au menu
				//comme itemWrapper (item qui le contient)
				if (results[0].subMenu){
					Menu.update({id: results[0].subMenu }, {itemWrapper : results[0]}).exec( function (err, results) {
						if (err) {
							console.error(" Erreur l'association du subMenu à l'item", err);
							return err;
						}
						else {
							console.log("association de l'itemWrapper au sous menu avec succès !");							
						}
					});
				}

				res.redirect('/item/show/'+results[0].id);
			}
		});		
	},
	destroy : function (req, res) {
		//destroy retourne un tableau avec les élément supprimés ou un seul objet
		Item.destroy({id: req.params.id}).exec(function (err, menu) {
			if(err) {
				console.error("Erreur de suppression du menu", err);
			 	return err;
			} 
			else {
				console.log("Suppression réussi - menus destroy : " + menu);
				res.redirect("/item/index");
			}
		});		
	}
};



