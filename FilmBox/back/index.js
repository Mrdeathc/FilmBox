/* 
    Va a contener la conexion con node con nuestra BD Mongo a traves de mongoose.
    */

   const mongoose = require('mongoose'); // Importamos mongoose para la conexión.
   const app = require('./app'); // Vamos a importar la logica de Express.
   const port = 4000; // Declaramos el puerto que deseenmos
   
   // Vamos a crear la logica de la conexion con la BD
   // el metodo connect recibe dos parametros, el primero la ruta de la BD a enlazar
   // y el segundo sera una funcion que a su vez recibira los parametros de error y respuesta
   mongoose.Promise = global.Promise;
   mongoose.connect('mongodb://localhost:27017/filmBox', (err, res)=>{
       if(err){
           console.log(`el error es: ${err}`);
       } else {
           console.log('Conexión Exitosa!!');
           app.listen(port, ()=>{
               console.log(`Puerto: ${port}`);
           });
       }
   }); 
   