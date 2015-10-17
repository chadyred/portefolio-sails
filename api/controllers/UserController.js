/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login : function (req, res) {
        res.view();
    },
	create: function (req, res) {
		console.error("Create URL lancée !");

		User.create({ email : req.body.email, password: req.body.password }, function (err, user) {
			if (err) {
				console.error(" Erreur lors de la création user", err);
				return err;
			}
			else {
				console.log ("L'utilisateur a été créé avec succès. Il a pour id" + user.id + " et son mail est " + user.email);
			}
		})

		redirect('/');
	}
};

