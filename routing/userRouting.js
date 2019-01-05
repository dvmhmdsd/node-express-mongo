const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//const bodyParser = require('body-parser');
const passport = require('passport');


// get the article module
let User = require('../models/users');
/* 
const validator = require('express-validator');
router.use(validator());

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json()); */
/* 
router.use(passport.initialize());
router.use(passport.session()); */
// register form
router.get('/register', (req, res) => {
    res.render('register');
});

// add registrsation
router.post('/register', (req, res) => {

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password is required').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    }

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
                console.log(err);
                return;
            }

            newUser.password = hash;

            newUser.save().then(() => {
                req.flash('success', 'registered successfully');
                res.redirect('/users/login');
            })
        })
    })


});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'you\'re logged out');
    res.redirect('/users/login');
})


module.exports = router;