/* 
    el modelo es la representacín en codigo de la estructura de nuestras tablas
    (Colecciones en Mongo) de neustra base de datos
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Creamos un objeto schema para nuestra colección

// Crearemos una instancia del objeto Schema

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    role: String, // ROLE_ADMIN || ROLE_USER
    term: String, //type: Date, default: Date.now()
    count: String, // COUNT_BASIC || COUNT_PREMIUM
    favorite:[]
});

// Exportar el Schema
// mongoose.model recibe dos parametros que son el nombre de la coleccion
// y la estructura o el esquema (Schema) de la coleccion.

module.exports = mongoose.model('User', UserSchema);