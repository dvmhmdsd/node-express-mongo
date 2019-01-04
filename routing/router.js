const express = require('express');
const router = express.Router();

// get the article module
let Article = require('../models/model');


router.get('/articles', (req, res) => {
    res.render('add_article', {
        title: 'articles'
    });
});

router.post('/articles', (req, res) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Articles',
             errors: errors
        })
    }


    let articles = new Article();
    articles.title = req.body.title;
    articles.body = req.body.body;

    articles.save().then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    })
    return;
});

// show a specific article
router.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        })
    })
});


// get the form to update the form
router.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            article: article
        })
    })
})
//edit the article
router.post('/articles/edit/:id', (req, res) => {
    let articles = {};
    articles.title = req.body.title;
    articles.body = req.body.body;

    let query = {_id: req.params.id};

    Article.update(query, articles).then(() => {
        
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    })
    return;
});


// delete a record 
router.delete('/articles/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, err => {
        if(err) console.log(err);
    });
    res.send('success');
})

module.exports = router;