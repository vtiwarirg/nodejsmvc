var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../server/models/').users;

passport.use(new LocalStrategy({
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