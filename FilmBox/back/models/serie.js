const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var SerieSchema = new Schema({
    title: String,
    duration: String, // X temporadas || X capítulos
    genre: String, // "genre1 genre2 genre3 ... genreX"
    date: String, // "year1 year2 year3 ... yearX"
    synopsis: String,
    image: String,
});

module.exports = mongoose.model('Serie', SerieSchema);