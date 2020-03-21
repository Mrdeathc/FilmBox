const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var MovieSchema = new Schema({
    title: String,
    duration: String,
    genre: String,
    year: String,
    synopsis: String,
    image: String,
    link: String
});

module.exports = mongoose.model('Movie', MovieSchema);