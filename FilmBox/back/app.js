  /* 
    Va a contener toda la logica de ruteo de Express.
    Declaración de rutas, uso de middleware body-parser.
    Parmisos de acceso a cualquier cliente (Permisos al aplicativo Front heacho en Angular)
*/

const express = require ('express'); // importamos express 
const bodyParser = require('body-parser'); // Permitir analizar datos de la URL
// var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session')
// var bcrypt = require('bcrypt');

const app = express(); // Aplicacion express
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));
// Solicitar las rutas de acceso a cada función que ejecutará nuestra aplicación 

const userRoutes = require('./routes/userRoutes');    
const movieRoutes = require('./routes/movieRoutes');    
const serieRoutes = require('./routes/serieRoutes');    
const episodeRoutes = require('./routes/episodeRoutes');   

// -- MIDDLEWARES -- 
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(cookieSession({
//     secret: 'MiClaveSecreta123',
//     // Cookie Options
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }));
// bcrypt.hash("alguna-contraseña", 10).then(function(hash) {
//     // almacena la contraseña en la base de datos
//   })
//Declaramos el analisis de datos con body-parser
// Configuración de permisis de acceso
  // CORS
  //   Cross Origin Resources Sharing
app.use((req,res,next)=>{//todos estos pernisoso se envian por las cabeceras http, estos derivan de ajax
  //todos los dminios(origenes)
    res.header('Access-Control-Allow-Origin','*');//res.header('Access-Control-Allow-Origin','http://www.kindlypod.com');
  //todos los metadatos
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  //todos los metodos http(métodos d epetición)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //Confirmación d elos metodos a utilizar
    res.header('Allow','GET, POST, PUT, DELETE, OPTIONS');

    next();
});

// Consumo de las rutas

app.use('/api', userRoutes);
app.use('/api', movieRoutes);
app.use('/api', serieRoutes);
app.use('/api', episodeRoutes);

// -- FIN MIDDLEWARES --

module.exports = app;