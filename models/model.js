const mongoose = require('mongoose');

//set a schema
let modelSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = mongoose.model('article', modelSchema);

module.exports = Article;