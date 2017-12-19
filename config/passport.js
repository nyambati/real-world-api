const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

const localStrategy = new Strategy(
    { usernameField: 'user[email]', passwordField: 'user[password]' },
    (email, password, done) => {
        return User.findOne({ email })
            .then(user => {
                if (!user || !user.validPassword(password)) {
                    return done(null, false, {
                        error: 'Invalid email or password'
                    })
                }
                return done(null, user)
            })
            .catch(done)
    });

passport.use(localStrategy);
