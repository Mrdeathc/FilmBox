/* 
    Se encargara de recibir los datos que el usuario realiza desde la vista, procesandolos
    para enviarlos al modelo y que este los pueda corroborar con la base de datos para posteriormente
    guardarlos, tambien tendra toda la logica de las consultas, actualizaciones y eliminaciones.
*/

const User = require('../models/user'); // Importamos el modelo de usuario
const fs =require('fs');
const path = require('path');
// const bcrypt = require('bcrypt');
// const jwt = require('../servicios/jwt');


// Funcion registro de usuario
function newUser(req, res){
    // Instanciar el objeto Usuario 
    var user = new User();
    // Guardar el cuerpo de la petición para mejor acceso de los datos que el usuario esta enviando
    // parametros = {"nombre": "", "apellido": "", "correo": "", "contraseña": ""}
    var params = req.body;
    //
    var date= new Date();
    user.name= params.name;
    user.email= params.email.toLowerCase();
    user.password= params.password;
    user.image= "L-xaBo3li36rJB4HAx5trUQZ.jpg";
    user.role = "ROLE_USER";
    // if(user.name.includes('admin')){
    //     user.role = "ROLE_ADMIN"; 
    // }
    user.count= "COUNT_BASIC";
    // if(user.name.includes('premium')){
    //     user.count= "COUNT_PREMIUM";
    // }
    user.term= date.getDate();
     // BASIC_COUNT || PREMIUN_COUNT
    user.favorite= [];

    // if(parametros.contrasena){
    //     bcrypt.hash(parametros.contrasena, null, null, function(err, hash){
    //         user.contrasena=hash;
    //     });
    user.save((err, newUser) => {
        if (err) {
          // El primer error a validar será a nivel de servidor e infraestructura
          // Para esto existen states o estados.
          res.status(500).send({ message: "Error en el servidor" }); //500-599 errores posibles a nivel de servidores, el msj lo envia por el head a nivel de metadatos
        } else {
          if (!newUser) {
            //404 -> Pagina No encontrada
            //200 -> OK pero con una alerta indicando que hay datos inválidos
            res.status(200).send({
              message: "No fue posible realizar el registro"
            });
          } else {
            //200 -> ok
            //se estarían enviando los datos, aun no se ha validado contraseña, ni el ingreso correcto de los datos, encriptado datos, solo se está enviando los datos.
            //Recomendado tener un archivo por cada cosa que necesite, por ejemplo un archivo solo de validaciones para poder llamar donde se necesite.
            res.status(200).send({newUser});
          }
        }
      });
    }

// LOGIN USUARIO

function userLogin(req, res) {
    var params = req.body;
    
    var userMail = params.email;
    var userPassword = params.password;
  
    // buscamos al usuario a través del correo. Usaremos toLowerCase() para evitar problemas de datos
    // con mayusculas, todo lo convertimos en minusculas.
    User.findOne(
      { email: userMail}, (err, loguedUser) => {
        if (err) {
          res.status(500).send({ message: "Error en el servidor!" });
        } else {
            //si no existe usuario logueado
          if (!loguedUser) {
            res.status(200).send({ message: "Ususario NO registrado" });
          } else {
            if (loguedUser.password != userPassword) {
              res.status(200).send({ message: "Contraseña incorrecta" });
            } else {
              res.status(200).send({ loguedUser });
            }
          }
        }
      });
  }

function userLogout(req, res) {
    res.status(200).send({ message: "Logout"});
  }
// function login(req, res){
//     var parametros = req.body;
//     console.log(parametros);
    
//     var correoUsuario = parametros.correo;
//     var contraUsuario = parametros.contrasena;

//     // Buscamos al usuario a través del correo. Usaremos toLowerCase() para evitar problema de datos

//     Usuario.findOne({correo: correoUsuario.toLowerCase()}, (err, usuarioLogueado)=>{
//         if(err){
//             res.status(500).send({message: "Error en el servidor!!"});
//         } else {
//             if(!usuarioLogueado){
//                 res.status(200).send({message: "No has podido iniciar sesión. Verifica los datos"});
//             }else{
//                 bcrypt.compare(contraUsuario,usuarioLogueado.contrasena, function(err, check){
//                     if(check){
//                         if(params.gethash){
//                             res.status(200).send({
//                                 token: jwt.createToken(usuarioLogueado)
//                             });
//                         }
//                         else{
//                             res.status(200).send({usuario: usuarioLogueado});
//                         }
//                     }
//                     else{
//                         res.status(200).send({message: "Contraseña incorrecta"});
//                     }
//                 });
//                 if(usuarioLogueado.contrasena != contraUsuario){
//                     res.status(200).send({message: "Contraseña incorrecta"});
//                 }else{
//                     res.status(200).send({usuario: usuarioLogueado});
//                 }
//             }
//         }
//     });
// }

//actualizar usuario
function userUpdate(req,res){
    var userId = req.params.id;
    var newUserData = req.body;
    
    User.findByIdAndUpdate(userId, newUserData, (err, updatedUser)=>{
        if(err){
            res.status(500).send({message:"Error en elservidor"});
        }
        else{
            if(!updatedUser){
                res.status(200).send({message:"No fue posible actualizar los datos"});
            }
            else{
                res.status(200).send({updatedUser});
            }
        }
    });
}

function userDelete(req,res){
    var userId = req.params.id;

    User.findByIdAndDelete({_id: userId}, (err, deletedUser)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!deletedUser){
                res.status(200).send({message:"No fue posible eliminar: User"});
            }
            else{
                res.status(200).send({deletedUser});
            }
        }
    });
}

function usersServe(req,res){

    User.find({}, (err, users)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!users){
                res.status(200).send({message:"No fue posible mostrar :Users"});
            }
            else{
                res.status(200).send({users});
            }
        }
    });
}

function userServe(req,res){
    var userId=req.params.id;
    User.findById(userId, (err, user)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!user){
                res.status(200).send({message:"No fue posible mostrar :Users"});
            }
            else{
                res.status(200).send({user});
            }
        }
    });
}

function imageUpload(req,res){
    var userId=req.params.id;
    var fileName = "No he subido ninguna imagen";
   //  validacion de que la imagen si se esta recibiendo 
   if(req.files){
       // verifivcacion de ruta del archivo , el nombre y la extencion  
       // file es para verificar si el archivo esta existe o cual es la ruta 
       var filePath =req.files.imageFile.path;
       var fileSplit =filePath.split('\\');
       var fileName = fileSplit[2];
       var extencionImage = fileName.split('\.');
       var extencionFile= extencionImage[1];
       // validacion del formato de cada imagen y si es aceptable 
       if(extencionFile == "png" || extencionFile == "jpg" || extencionFile =="jpeg"){
           // actualizar del usuario, el campo imagen que inicialmente teníamos null
           User.findByIdAndUpdate({_id:userId},{image: fileName},(err,userWithImage)=>{
              if(err){
                  res.status(500).send({message: "Error en le servidor"}) ;            
             }else{
                 if(!userWithImage){
                     res.status(200).send({message:"no fue posible subir la img"});
                 }else{
                     res.status(200).send({
                         image: fileName                      
                       });
                 }
             }
           });
           // validacion de la extención
       }else{
           //  formato invalido
           res.status(200).send({message:"Formato Invalido !! no es una imagen"});
           }
       }else{
       // no existe una imagen para subir
       res.status(200).send({message:"no has subido una imgen"});
       }
    }

function imageServe(req,res){
    var imageFile=req.params.imageFile;
    var imageRoute= './files/users/'+imageFile;
    fs.exists(imageRoute,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(imageRoute));
        }else{
            res.status(200).send({message: "Imagen no encontrada :("});
        }
    });
}

function like(req,res){
    var userId = req.params.userId;
    var favoriteId  = req.params.favoriteId;

    User.findByIdAndUpdate(userId, {$addToSet: {favorite: favoriteId}}, (err, updatedUser)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!updatedUser){
                res.status(200).send({message:"No fue posible agregar a Favoritos"});
            }
            else{
                res.status(200).send({message:"Agregada a tus favoritos", updatedUser});
            }
        }
    });
}

function unlike(req,res){
    var userId = req.params.userId;
    var favoriteId=req.params.favoriteId;

    User.findByIdAndUpdate(userId, {$pull:{favorite: favoriteId}}, (err, updatedUser)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!updatedUser){
                res.status(200).send({message:"No fue posible eliminar de Favoritos"});
            }
            else{
                res.status(200).send({message:"Eliminada de tus favoritos", updatedUser});
            }
        }
    });
}
// Exportacion de las funciones creadas 

module.exports = {
    newUser,
    userLogin,
    userLogout,
    userUpdate,
    userDelete,
    userServe,
    usersServe,
    imageUpload,
    imageServe,
    like,
    unlike
}