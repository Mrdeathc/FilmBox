
const express = require('express');
const MovieController = require('../controllers/movieController');
const multipart =require('connect-multiparty'); //importamos el paquete 
const imagePath= multipart({uploadDir:'./files/movies'});  //ruta de archivos


var api = express.Router();

api.post('/pelicula', MovieController.newMovie);

api.get('/pelicula', MovieController.moviesServe);

api.get('/pelicula/:id', MovieController.movieServe);

api.put('/pelicula/:id', MovieController.movieUdpate);

api.delete('/pelicula/:id', MovieController.movieDelete);

api.get('/buscarPelicula/:key=:value', MovieController.findMovies);

api.put('/imagenPelicula/:id', imagePath, MovieController.imageUpload);

api.put('/videoPelicula/:id', imagePath, MovieController.videoUpload);

api.get('/imagenPelicula/:imageFile', imagePath, MovieController.imageServe);

api.get('/videoPelicula/:videoFile', imagePath, MovieController.videoServe);

module.exports = api;