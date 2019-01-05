const localStrategy = require('passport-local').Strategy;
const user = require('../models/users');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use(new localStrategy({

        passReqToCallback : true
    },
    function(req, username, pass, done) {
        //match username
        let query = {username: username};
        user.findOne(query, (err, user) => {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: 'user not found'})
            }

            //match pass
            bcrypt.compare(pass, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'wrong password'})
                }

            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
      });
}