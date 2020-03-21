const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var EpisodeSchema = new Schema({
    series: String,
    season: String,
    episode: String,
    title: String,
    duration: String,
    date: String,
    synopsis: String,
    image: String,
    link: String
});

module.exports = mongoose.model('Episode', EpisodeSchema);