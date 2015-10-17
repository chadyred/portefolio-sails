/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require("moment");

moment.locale('fr');

module.exports = {
	index: function (req, res) {

		Article.find({}, function (err, results) {				
			
			//res.render('article/index', {articles : results});
			res.view('article/index', {articles : results, moment: moment});
		});
	},
	create: function (req, res) {
		console.error("Create URL lancée !");
		console.log("req.session.passport.user : " + req.session.passport);
		Article.create({ titre : req.body.titre, contenu: req.body.contenu, auteur: req.session.passport.user }, function (err, article) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("L'article a été créé avec succès. Il a pour id" + article.id + " et s'intitul " + article.titre);
			}
		})
	},
	new : function (req, res) {
		res.view('article/new');
	},
	index: function (req, res) {

		Article.find({}, function (err, results) {				
			
			//res.render('article/index', {articles : results});
			res.view('article/index', {articles : results, moment: moment});
		});
	},	
	show: function (req, res) {
		console.error("Show URL lancée !");
		console.log("req.session.passport.user : " + req.session.passport);
		Article.findOne(req.param('id')).populate('item').exec( function (err, article) {
			if (err) {
				console.error(" Erreur lors de la visualisation", err);
				return err;
			}
			else {
				console.log ("Le role a été trouvé");

				Menu.find({}).populate('role').populate('items').exec(function (err, menus){
					if (err) {
						console.error(" Erreur lors récupération des menu dans le show article", err);
						return err;
					}
					else {
						console.error(" Article et menus récupéré avec succés", err);
						res.view('article/show', { menus : menus, article : article });					
					}
				});

			}

		});
	},	
	edit : function (req, res) {
		Article.findOne(req.param('id')).populate('item').exec(function (err, article) {
			if (err) {
				console.error(" Erreur lors de la création", err);
				return err;
			}
			else {
				console.log ("L'article a été trouvé");

				Item.find({}, function (err, results) {
					if(err) {
						console.error("Erreur de récupération des Items pour l'article", err);
					 	return err;
					} 
					else {
						console.log ("Les menus pour le article a édité ont été trouvés");					
					}

					res.view('article/edit', { article : article, items : results});	
				});	

			}

		});
		
	},
	update : function (req, res) {

		if(req.body.item === "-1") 
			req.body.item = null;

		//On met à null le roll qui a le menu de notre roll
		Item.findOne(req.body.item, function (err, result) {
			if(err) {
				console.error("Item pas trouvé erreur", err);
				return err;
			}
			else {
				console.error("Item trouvé que possédé cet Article");

				if(typeof result !== "undefined"){

					Article.update({item: result.id}, {item: null}).exec(function (err, articlePrev) {
						if(err) {
							console.error("Erreur lors de la mise à jour de l'article associé à l'item ptécédent", err);
							return err;
						}
						else {
							console.log("Succès d'update de l'article associé à l'item précédent : " + articlePrev);
						}
					});
				}
			}
		});

		Article.update({ id: req.params.id }, { titre: req.body.titre, contenu: req.body.contenu, item: req.body.item}).exec( function afterwards(err, results) {
			if(err) {
				console.error("Erreur update role", err);
			 	return err;
			} 
			else {
				console.log("Mise-à-jour effectuées " + results[0].id);


				console.log("Update item - results[0].role = " + results[0].item);



				//Puis on met à null l'item sur lequel pointe le menu AVANT de mettre l'article actuel correspondant
				Item.update({article: results[0].id}, {article: null}).exec( function (err, result) {
					if(err) {
						console.error("Erreur d'update de l'item associé à l'article", err);
						return err;
					}
					else {
						console.log("Succès d'update du menu lié à l'article : " + result);
						//Le rôle du menu précédent peut être différent de celui actuel
						
					}
				});

				//Si l'item vaut null, inutile de mettre à jour...une valeur NULL sinon on met ce role au menu
				if (results[0].item){
					Item.update({id: results[0].item }, {article : results[0]}).exec( function (err, results) {
						if (err) {
							console.error(" Erreur l'association de l'item à l'article", err);
							return err;
						}
						else {
							console.log("association de l'item à l'article avec succès !");							
						}
					});
				}
				res.redirect('/article/show/'+results[0].id);
			}
		});		
	},
	destroy : function (req, res) {
		//destroy retourne un tableau avec les élément supprimés ou un seul objet
		Article.destroy({id: req.params.id}).exec(function (err, role) {
			if(err) {
				console.error("Erreur de suppression de l'article", err);
			 	return err;
			} 
			else {
				console.log("Suppression réussi - role destroy : " + role);
				res.redirect("/article/index");
			}
		});		
	}
};
