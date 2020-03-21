const Movie = require('../models/movie'); 
const fs =require('fs');
const path = require('path');

function newMovie(req, res){

    var movie = new Movie();
    var params = req.body;

    movie.title = params.title;
    movie.duration = params.duration;
    movie.genre = params.genre;
    movie.year = params.year;
    movie.synopsis = params.synopsis;
    movie.image = null;
    movie.link = params.link;

    movie.save((err, newMovie)=>{
        if(err){
            res.status(500).send({ message: "Error en el servidor"});
        } else {
            if(!newMovie){

                res.status(200).send({message: "No fue posible crear: Movie"});
            } else {
                res.status(200).send({newMovie});
            }
        }
    });
}

function movieUdpate(req,res){
    var movieId = req.params.id;
    var newMoviedata= req.body;

    Movie.findByIdAndUpdate(movieId, newMoviedata, (err, updatedMovie)=>{
        if(err){
            res.status(500).send({message:"Error en elservidor"});
        }
        else{
            if(!updatedMovie){
                res.status(200).send({message:"No fue posible actualizar: Movie"});
            }
            else{
                res.status(200).send({updatedMovie});
            }
        }
    });
}

function movieServe(req,res){
    var movieId = req.params.id;

    Movie.findById(movieId, (err, movie)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});            
        }
        else{
            if(!movie){
                res.status(200).send({message:"No fue posible mostrar: Movie"});
            }
            else{
                res.status(200).send({ movie});
            }
        }
    });
}

function moviesServe(req,res){

    Movie.find({}, (err, movies)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!movies){
                res.status(200).send({message:"No fue posible mostrar :Movies"});
            }
            else{
                res.status(200).send({movies});
            }
        }
    });
}

function findMovies(req,res){
    var key = req.params.key;
    var value = req.params.value;
    // var valueN = value.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    // console.log(valueN);

    function noAccent(cad) {
        cad= cad.replace(/a/ig, '[a,á]')
           .replace(/e/ig,'[e,é]')
           .replace(/i/ig,'[i,í]')
           .replace(/o/ig,'[o,ó]')
           .replace(/u/ig,'[u,ü,ú]');
           return cad;
   }
    switch(key){
        case "genre":var search={genre:{$regex:noAccent(value), $options:'i'}};break;
        case "synopsis":var search={synopsis:{$regex:noAccent(value), $options:'i'}};break;
        case "year":var search={year:{$regex:noAccent(value), $options:'i'}};break;
        case "title":
        default: var search={title:{$regex:noAccent(value), $options:'i'}};break;
    }
    //Movie.find(search, '_id title year', (err, foundMovies)=>{
    Movie.find(search, (err, foundMovies)=>{
        
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{  
            if(foundMovies.length==0){
                res.status(200).send({message:"No fue posible encontrar: Movies"});
            }
            else{
                res.status(200).send({foundMovies});
            }
        }
    });
}

function movieDelete(req,res){
    var movieId = req.params.id;

    Movie.findByIdAndDelete({_id:movieId}, (err, deletedMovie)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!deletedMovie){
                res.status(200).send({message:"No fue posible eliminar: Movie"});
            }
            else{
                res.status(200).send({deletedMovie});
            }
        }
    });
}

function imageUpload(req,res){
    var movieId=req.params.id;
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
           Movie.findByIdAndUpdate(movieId, {image: fileName}, (err,movieWithImage)=>{
              if(err){
                  res.status(500).send({message: "Error en le servidor"}) ;            
             }else{
                 if(!movieWithImage){
                     res.status(200).send({message:"No fue posible subir: Imagen"});
                 }else{
                     res.status(200).send({
                         image: fileName,
                         movie: movieWithImage                       
                       });
                 }
             }
           });
           // validacion de la extención
       }else{
           //  formato invalido
           res.status(200).send({message: "Formato inválido => NO es una imagen"});
           }
       }else{
       // no existe una imagen para subir
       res.status(200).send({message: "No has subido: Imagen"});
       }
    }

function videoUpload(req,res){
        var movieId=req.params.id;
        var fileName = "No he subido ningun video";
       //  validacion de que la imagen si se esta recibiendo 
       if(req.files){
           // verifivcacion de ruta del archivo , el nombre y la extencion  
           // file es para verificar si el archivo esta existe o cual es la ruta 
           var filePath =req.files.videoFile.path;
           var fileSplit =filePath.split('\\');
           var fileName = fileSplit[2];
           var extencionVideo = fileName.split('\.');
           var extencionFile= extencionVideo[1];
           // validacion del formato de cada imagen y si es aceptable 
           if(extencionFile == "mp4"){
               // actualizar del usuario, el campo imagen que inicialmente teníamos null
               Movie.findByIdAndUpdate(movieId, {link: fileName}, (err,movieWithVideo)=>{
                  if(err){
                      res.status(500).send({message: "Error en le servidor"}) ;            
                 }else{
                     if(!movieWithVideo){
                         res.status(200).send({message:"No fue posible subir: Video"});
                     }else{
                         res.status(200).send({
                             video: fileName,
                             movie: movieWithVideo                       
                           });
                     }
                 }
               });
               // validacion de la extención
           }else{
               //  formato invalido
               res.status(200).send({message: "Formato inválido => NO es una video"});
               }
           }else{
           // no existe una imagen para subir
           res.status(200).send({message: "No has subido: Video"});
           }
        }

function imageServe(req,res){
    var imageFile=req.params.imageFile;
    var imageRoute= `./files/movies/${imageFile}`;
    fs.exists(imageRoute,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(imageRoute));
        }else{
            res.status(200).send({message: "Imagen no encontrada :("});
        }
    });
}

function videoServe(req,res){
    var videoFile=req.params.videoFile;
    var videoRoute= `./files/movies/${videoFile}`;
    fs.exists(videoRoute,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(videoRoute));
        }else{
            res.status(200).send({message: "Video no encontrado :("});
        }
    });
}


module.exports = {
    newMovie,
    movieUdpate,
    movieDelete,
    movieServe,
    moviesServe,
    findMovies,
    imageUpload,
    imageServe, 
    videoUpload,
    videoServe
}