var passport = require('passport');

module.exports = {

    //Cette configuration indique que toute action automtique n'est pas autorisé. En effet, les route seront créée.
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
    checkLogin: function(req, res) {

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) { 
                    // res.send(err);
                    res.redirect('/user/login');
                }
                else {
                    res.redirect('/admin/homepage');
                }
                // return res.send({
                //     message: info.message,
                //     user: user
                // });
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};