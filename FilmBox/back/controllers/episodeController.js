const Episode = require('../models/episode'); 
const Serie = require('../models/serie'); 
const fs =require('fs');
const path = require('path');

function newEpisode(req, res){

    var episode = new Episode();
    var params = req.body;

    episode.series = params.series;
    episode.season = params.season;
    episode.episode = params.episode;
    episode.title = params.title;
    episode.duration = params.duration;
    episode.date = params.date;
    episode.synopsis = params.synopsis;
    episode.image = null;
    episode.link = params.link;

    episode.save((err, newEpisode)=>{
        if(err){
            res.status(500).send({ message: "Error en el servidor"});
        } else {
            if(!newEpisode){
                res.status(200).send({message: "No fue posible crear: Episode"});
            } else {
                res.status(200).send({newEpisode});
            }
        }
    });
}

function episodeUdpate(req,res){
    var episodeId = req.params.id;
    var newEpisodeData= req.body;

    Episode.findByIdAndUpdate(episodeId, newEpisodeData, (err, updatedEpisode)=>{
        if(err){
            res.status(500).send({message:"Error en elservidor"});
        }
        else{
            if(!updatedEpisode){
                res.status(200).send({message:"No fue posible actualizar: Episode"});
            }
            else{
                res.status(200).send({updatedEpisode});
            }
        }
    });
}

function episodeServe(req,res){
    var episodeId = req.params.id;

    Episode.findById(episodeId, (err, episode)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});            
        }
        else{
            if(!episode){
                res.status(200).send({message:"No fue posible mostrar: episode"});
            }
            else{
                res.status(200).send({episode});
            }
        }
    });
}

function episodesServe(req,res){

    Episode.find({}, (err, episodes)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!episodes){
                res.status(200).send({message:"No fue posible mostrar :episodes"});
            }
            else{
                res.status(200).send({episodes});
            }
        }
    });
}

function episodeDelete(req,res){
    var episodeId = req.params.id;

    Episode.findByIdAndDelete({_id: episodeId}, (err, deletedEpisode)=>{
        if(err){
            res.status(500).send({message: "Error en el servidor"});
        }
        else{
            if(!deletedEpisode){
                res.status(200).send({message: "No fue posible eliminar: Episode"});
            }
            else{
                res.status(200).send({deletedEpisode});
            }
        }
    });
}

function imageUpload(req,res){
    var episodeId=req.params.id;
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
           Episode.findByIdAndUpdate(episodeId, {image: fileName}, (err,episodeWithImage)=>{
              if(err){
                  res.status(500).send({message: "Error en le servidor"}) ;            
             }else{
                 if(!episodeWithImage){
                     res.status(200).send({message:"No fue posible subir: Imagen"});
                 }else{
                     res.status(200).send({
                         image: fileName,
                         episode: episodeWithImage                       
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

function imageServe(req,res){
    var imageFile=req.params.imageFile;
    var imageRoute= `./files/series/${imageFile}`;
    fs.exists(imageRoute,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(imageRoute));
        }else{
            res.status(200).send({message: "Imagen no encontrada :("});
        }
    });
}

function videoUpload(req,res){
    var episodeId=req.params.id;
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
           Episode.findByIdAndUpdate(episodeId, {link: fileName}, (err,episodeWithVideo)=>{
              if(err){
                  res.status(500).send({message: "Error en le servidor"}) ;            
             }else{
                 if(!episodeWithVideo){
                     res.status(200).send({message:"No fue posible subir: Video"});
                 }else{
                     res.status(200).send({
                         link: fileName,
                         episode: episodeWithVideo                       
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

function videoServe(req,res){
var videoFile=req.params.videoFile;
var videoRoute= `./files/series/${videoFile}`;
fs.exists(videoRoute,(exists)=>{
    if(exists){
        res.sendFile(path.resolve(videoRoute));
    }else{
        res.status(200).send({message: "Video no encontrado :("});
    }
});
}

module.exports = {
    newEpisode,
    episodeUdpate,
    episodeDelete,
    episodeServe,
    episodesServe,
    imageUpload,
    imageServe,
    videoUpload,
    videoServe
}