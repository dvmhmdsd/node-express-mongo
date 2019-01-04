const express = require('express');
const router = express.Router();

// get the article module
let User = require('../models/users');

// register form
router.get('/register', (requestAnimationFrame, res) => {
    res.render('register');
})

module.exports = router;