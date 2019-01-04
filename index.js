const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routing/router');

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

app.use(router);

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

app.listen(3000, () => {
    console.log('you are running the app on port: 3000 ...');
});