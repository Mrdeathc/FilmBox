
const express = require('express');
const SerieController = require('../controllers/serieController');
const multipart =require('connect-multiparty'); //importamos el paquete 
const imagePath= multipart({uploadDir:'./files/series'});  //ruta de archivos

var api = express.Router();

api.post('/serie', SerieController.newSerie);

api.get('/serie', SerieController.seriesServe);

api.get('/serie/:id', SerieController.serieServe);

api.put('/serie/:id', SerieController.serieUdpate);

api.delete('/serie/:id', SerieController.serieDelete);

api.get('/buscarSeries/:llave&:valor', SerieController.findSeries);

api.put('/imagenSerie/:id', imagePath, SerieController.imageUpload);

api.get('/imagenSerie/:imageFile', imagePath, SerieController.imageServe);

module.exports = api;