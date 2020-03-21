/* 
    Vamos a crear el manejo de rutas de express para nuestra API 
    se encargara de manejar las rutas del lado backend
*/

const express = require('express');
const UserController = require('../controllers/userController'); // Importamos el controlador de las funciones
const multipart =require('connect-multiparty'); //importamos el paquete 
const imagePath= multipart({uploadDir:'./files/users'});  //ruta de archivos

var api = express.Router(); // Cargamos el manejador de rutas de Express
//var auth = require('../middlewares/authenticated');

/* 
    Estos son denominados metodos HTTP y hacen parte de las caracteristicas de una API 
    POST -> Agregar datos
    GET -> Obtener los datos
    PUT -> Actualizar datos
    DELETE -> Eliminar datos
    
*/

// Declaracion de las rutas que daran paso a la ejecucion de las funciones 
// Tuta Registro usuario

api.post('/registro', UserController.newUser);
// Ruta login usuario
// en el caso de un logi o un inicio de sesion utilizamos el emtodo POST en vez de GET
api.post('/login', UserController.userLogin);

api.post('/logout', UserController.userLogout);
//
api.put('/usuario/:id', UserController.userUpdate);

api.delete('/usuario/:id', UserController.userDelete);

api.get('/usuarios', UserController.usersServe);

api.put('/like/:userId/:favoriteId', UserController.like);

api.put('/unlike/:userId/:favoriteId', UserController.unlike);

api.put('/imagenUsuario/:id', imagePath, UserController.imageUpload);

api.get('/imagenUsuario/:imageFile', imagePath, UserController.imageServe);

api.get('/usuario/:id', UserController.userServe);
// Exportación del archivo usuarioRutas
module.exports = api;