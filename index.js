const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
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

// use express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// use express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// use express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

app.post('/articles', (req, res) => {
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


// delete a record 
app.delete('/articles/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, err => {
        if(err) console.log(err);
    });
    res.send('success');
})

app.listen(3000, () => {
    console.log('you are running the app on port: 3000 ...');
});