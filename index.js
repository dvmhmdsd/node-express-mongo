
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodedb', { useNewUrlParser: true });

let db = mongoose.connection;

//check the connection
db.once('open', () => {
    console.log('connected succefully');
})

//check for errors
db.on('error', err => {
    console.log(err);
});


const app = express();

//set the view engine dir but it's by default 'views'
//app.set('views', path.join(__dirname, 'views'));

//select a specific view engine
app.set('view engine', 'pug');


// get the article module
let Article = require('./models/model');
// home route
app.get('/', (req, res) => {

    Article.find({}, (err, articles) => {
        if(err) throw err;
        res.render('index', {
            title: 'homes',
            articles: articles
        });
    })

    //res.send('hello');
    
});

app.get('/articles', (req, res) => {
    res.render('add_article', {
        title: 'articles'
    });
});

// use body parser and write its middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// load static files
app.use(express.static(path.join(__dirname, 'public')));

app.post('/articles', (req, res) => {
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
app.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        })
    })
});


// get the form to update the form
app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            article: article
        })
    })
})
//edit the article
app.post('/articles/edit/:id', (req, res) => {
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

app.listen(3000, () => {
    console.log('you are running the app on port: 3000 ...');
});