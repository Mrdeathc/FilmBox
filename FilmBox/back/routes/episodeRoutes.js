
const express = require('express');
const EpisodeController = require('../controllers/episodeController');
const multipart =require('connect-multiparty'); //importamos el paquete 
const imagePath= multipart({uploadDir:'./files/series'});  //ruta de archivos

var api = express.Router();

api.post('/episodio', EpisodeController.newEpisode);

api.get('/episodio', EpisodeController.episodesServe);

api.get('/episodio/:id', EpisodeController.episodeServe);

api.put('/episodio/:id', EpisodeController.episodeUdpate);

api.delete('/episodio/:id', EpisodeController.episodeDelete);

api.put('/imagenEpisodio/:id', imagePath, EpisodeController.imageUpload);

api.get('/imagenEpisodio/:imageFile', imagePath, EpisodeController.imageServe);

api.put('/videoEpisodio/:id', imagePath, EpisodeController.videoUpload);

api.get('/videoEpisodio/:videoFile', imagePath, EpisodeController.videoServe);

module.exports = api;