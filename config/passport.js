var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../server/models/').users;


// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


passport.use('local-login', new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        User.findOne({ where: { email: username } })
            .then((user) => {
                // Return if user not found in database
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }
                // Return if password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Password is wrong'
                    });
                }
                // If credentials are correct, return the user object
                return done(null, user);
            }).catch((err) => {
                if (err) { return done(err); }
            });
    }
));
