const Serie = require('../models/serie'); 
const Episode = require('../models/episode'); 
const fs =require('fs');
const path = require('path');

function newSerie(req, res){

    var serie = new Serie();

    var params = req.body;
    
    serie.title = params.title;
    serie.duration = params.duration;
    serie.genre = params.genre;
    serie.date = params.date;
    serie.sypnosis = params.sypnosis;
    serie.image = null;

    serie.save((err, newSerie)=>{
        if(err){
            res.status(500).send({ message: "Error en el servidor"});
        } else {
            if(!newSerie){

                res.status(200).send({message: "No fue posible crear: Serie"});
            } else {
                res.status(200).send({newSerie});
            }
        }
    });
}
function serieUdpate(req,res){
    var serieId = req.params.id;
    var newSerieData= req.body;

    Serie.findByIdAndUpdate(serieId, newSerieData, (err, updatedSerie)=>{
        if(err){
            res.status(500).send({message:"Error en elservidor"});
        }
        else{
            if(!updatedSerie){
                res.status(200).send({message:"No fue posible actualizar: serie"});
            }
            else{
                res.status(200).send({updatedSerie});
            }
        }
    });
}

function serieServe(req,res){
    var serieId = req.params.id;

    Serie.findById(serieId, (err, serie)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});            
        }
        else{
            if(!serie){
                res.status(200).send({message:"No fue posible mostrar: Serie"});
            }
            else{
                Episode.find({series: serieId},{$all},(err, episodes)=>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor"});            
                    }
                    else{
                        if(!episodes){
                            res.status(200).send({message:"No fue posible mostrar: Episodios"});
                        }
                        else{
                            res.status(200).send({serie: serie, episodes: episodes});
                        }
                    }
                });
            }
        }
    });
}

function seriesServe(req,res){

    Serie.find({}, (err, series)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!series){
                res.status(200).send({message:"No fue posible mostrar :Series"});
            }
            else{
                res.status(200).send({series});
            }
        }
    });
}

function serieDelete(req,res){
    var serieId = req.params.id;

    Episode.deleteMany({series: serieId}, (err, deletedEpisodes)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{
            if(!deletedEpisodes){
                res.status(200).send({message:"No fue posible eliminar: Episodios"});
            }
            else{

                Serie.findByIdAndDelete({_id: serieId}, (err, deletedSerie)=>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor"});
                    }
                    else{
                        if(!deletedSerie){
                            res.status(200).send({message:"No fue posible eliminar: Serie"});
                        }
                        else{
                            res.status(200).send({deletedSerie, deletedEpisodes});
                        }
                    }
                });
            }
        }
    });

   
}

function findSeries(req,res){
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
        case "sypnosis":var search={sypnosis:{$regex:noAccent(value), $options:'i'}};break;
        case "date":var search={date:{$regex:noAccent(value), $options:'i'}};break;
        case "title":
        default: var search={title:{$regex:noAccent(value), $options:'i'}};break;
    }
    //Serie.find({search}).sort({'peticiones.8':-1}).limit(10).exec(function(err, foundSeries){
    Serie.find(search, '_id title', (err, foundSeries)=>{
        
        if(err){
            res.status(500).send({message:"Error en el servidor"});
        }
        else{  
            if(foundSeries.length==0){
                res.status(200).send({message:"No fue posible encontrar: Series"});
            }
            else{
                res.status(200).send({foundSeries});
            }
        }
    });
}

function imageUpload(req,res){
    var serieId=req.params.id;
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
           Serie.findByIdAndUpdate(serieId, {image: fileName}, (err,serieWithImage)=>{
              if(err){
                  res.status(500).send({message: "Error en le servidor"}) ;            
             }else{
                 if(!serieWithImage){
                     res.status(200).send({message:"No fue posible subir: Imagen"});
                 }else{
                     res.status(200).send({
                         image: fileName,
                         serie: serieWithImage                       
                       });
                 }
             }
           });
           // validacion de la extención
       }else{
           //  formato invalido
           res.status(200).send({message:"Formato inválido => NO es una imagen"});
           }
       }else{
       // no existe una imagen para subir
       res.status(200).send({message:"No has subido: Imagen"});
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


module.exports = {
    newSerie,
    serieUdpate,
    serieDelete,
    serieServe,
    seriesServe,
    findSeries,
    imageUpload,
    imageServe
}