const express = require('express');
const router = express.Router();

//const bodyParser = require('body-parser');

// get the article module
let Article = require('../models/model');
/* 
const validator = require('express-validator');
router.use(validator());

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json()); */

router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'add_articles'
    });
});

router.post('/add', (req, res) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'add_Articles',
             errors: errors
        })
    }


    let articles = new Article();
    articles.title = req.body.title;
    articles.body = req.body.body;

    articles.save().then(() => {
        req.flash('success', 'article added');
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        return;
    })
    return;
});

// show a specific article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        })
    })
});


// get the form to update the form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            article: article
        })
    })
});

//edit the article
router.post('/edit/:id', (req, res) => {
    let articles = {};
    articles.title = req.body.title;
    articles.body = req.body.body;

    let query = {_id: req.params.id};

    Article.update(query, articles).then(() => {
        req.flash('success', 'article updated');
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    })
    return;
});


// delete a record 
router.delete('/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, err => {
        if(err) console.log(err);
    });
    res.send('success');
})

module.exports = router;