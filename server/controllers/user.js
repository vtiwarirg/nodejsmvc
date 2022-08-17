const User = require('../models/').users;
const passport = require('passport');
module.exports = {
    register(req, res) {
        User
            .create(req.body)
            .then(function (user) {
                var token
                token = user.generateJwt();

                var email = require('../lib/email');
                email.activate_email(req.body.name, req.body.email, 'ajfsajfsahg');

                res.status(200).json({ "token": token });
            }).catch(err => {
                res.status(200).json(err);
            });
    },
    login(req, res) {
        passport.authenticate('local', function (err, user, info) {
            var token;
            // If Passport throws/catches an error
            if (err) {
                res.status(404).json(err);
                return;
            }
            // If a user is found
            if (user) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            } else {
                // If user is not found
                res.status(401).json(info);
            }
        })(req, res);
    },
    profile(req, res) {
        if (!req.payload.id) {
            res.status(401).json({
                "message": "UnauthorizedError: private profile"
            });
        } else {
            User
                .findByPk(req.payload.id)
                .then((user) => {
                    res.status(200).json(user);
                }).catch((err) => {
                    res.status(200).json(err);
                });
        }
    },

}