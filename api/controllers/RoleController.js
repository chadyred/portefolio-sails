/**
 * RoleController
 *
 * @description :: Server-side logic for managing roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");
moment.locale('fr');

module.exports = {
	index: function (req, res) {

		Role.find({}).populate('menu').exec(function (err, results) {				
			
			//res.render('article/index', {articles : results});
			res.view('role/index', {roles : results, moment: moment});
		});
	},
	new : function (req, res) {
		
		Menu.find({}, function (err, results) {
			if(err) {
				console.error("Erreur de récupération des Menu pour le role", err);
			 	return err;
			} 
			else {
				res.view('role/new', { menus : results});
			}		
		});		
	},
	create: function (req, res) {

		if(req.body.menu === "-1")
			req.body.menu = null;

		console.error("Create URL lancée !");
		Role.create({ libelle : req.body.libelle, menu : req.body.menu }, function (err, role) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("role créé avec succès : " + role.id);
				//SI on a un menu associé, et quil s'agit d'une relation onetoone, on est obligé de mettre à jour ce menu
				//Sails n'y arrive pas tout seul ! Rappel: role.menu contient l'identifiant !
				if (role.menu){
					Menu.update({id: role.menu }, {role : role}).exec( function (err, results) {
						if (err) {
							console.error(" Erreur l'association du menu au role", err);
							return err;
						}
						else {
							console.log("association du menu au role avec succès !");
						}
					});
				}

				res.redirect("/role/show/" + role.id);
			}
		})
	},
	show: function (req, res) {
		console.error("Show URL lancée !");
		console.log("req.session.passport.user : " + req.session.passport);
		Role.findOne(req.param('id')).populate('menu').exec( function (err, role) {
			if (err) {
				console.error(" Erreur lors de la visualisation", err);
				return err;
			}
			else {
				console.log ("Le role a été trouvé");
				res.view('role/show', { role : role });

			}
		});
	},
	edit : function (req, res) {
		Role.findOne(req.param('id')).populate('menu').exec(function (err, role) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("Le menu a été trouvé");

			}

			Menu.find({}, function (err, results) {
				if(err) {
					console.error("Erreur de récupération des Menus pour le role", err);
				 	return err;
				} 
				else {
					console.log ("Les menus pour le role a édité ont été trouvés");					
				}

				res.view('role/edit', { role : role, menus : results});	
			});	
		});
		
	},
	update : function (req, res) {

		if(req.body.menu === "-1") 
			req.body.menu = null;

		//On met à null le roll qui a le menu de notre roll
		Menu.findOne(req.body.menu, function (err, result) {
			if(err) {
				console.error("Menu pas trouvé erreur", err);
				return err;
			}
			else {
				console.error("Menu trouvé que possédé ce rôle");

				if(typeof result !== "undefined"){

					Role.update({menu: result.id}, {menu: null}).exec(function (err, rolePrev) {
						if(err) {
							console.error("Erreur lors de la mise à jour du role qui contient le menu précédent", err);
							return err;
						}
						else {
							console.log("Succès d'update du role possédant le menu ayant notre rôle précédemment : " + rolePrev);
						}
					});
				}
			}
		});

		Role.update({ id: req.params.id }, { libelle: req.body.libelle, menu: req.body.menu}).exec( function afterwards(err, results) {
			if(err) {
				console.error("Erreur update role", err);
			 	return err;
			} 
			else {
				console.log("Mise-à-jour effectuées " + results[0].id);


				console.log("Update role - results[0].menu.id = " + results[0].menu);



				//Puis on met à null le role sur lequel pointe le menu AVANT de mettre le roll au bon
				Menu.update({role: results[0].id}, {role: null}).exec( function (err, result) {
					if(err) {
						console.error("Erreur d'update du menu lié au rôle", err);
						return err;
					}
					else {
						console.log("Succès d'update du menu lié au rôle : " + result);
						//Le rôle du menu précédent peut être différent de celui actuel
						
					}
				});

				//Si le menu vaut null, inutile de mettre à jour...une valeur NULL sinon on met ce role au menu
				if (results[0].menu){
					Menu.update({id: results[0].menu }, {role : results[0]}).exec( function (err, results) {
						if (err) {
							console.error(" Erreur l'association du menu au role", err);
							return err;
						}
						else {
							console.log("association du menu au role avec succès !");

							
						}
					});
				}
				res.redirect('/role/show/'+results[0].id);
			}
		});		
	},
	destroy : function (req, res) {
		//destroy retourne un tableau avec les élément supprimés ou un seul objet
		Role.destroy({id: req.params.id}).exec(function (err, role) {
			if(err) {
				console.error("Erreur de suppression du role", err);
			 	return err;
			} 
			else {
				console.log("Suppression réussi - role destroy : " + role);
				res.redirect("/role/index");
			}
		});		
	}
};

