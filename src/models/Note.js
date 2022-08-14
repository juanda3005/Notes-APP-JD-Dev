const mongoose=require('mongoose');
const {Schema}=mongoose;//solo solicito schema de mongoose

//crear un esquema de notas
const NweSchemas=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    //los siguientes atributos no son estrictamente necesarios, pero es bueno para tener mas información acerca de los datos
    date:{type:Date,default:Date.now},

    //enlace entre cada nota y el usuario que la creó, si no hago esto al logearse un usuario le apreceriasn
    //las notas de todos los usuarios
    user:{type:String}//donde se crea una nota nueva, es de cir 
    //en la ruta notes/new-note en notes.js se le asigna el id de usuario a esa nota
    //luego en la ruta /notes donde se le asigna a la consulta find() el usuario de cada nota
    //user:{type:Schema.Types.ObjectId,ref:'User'}
});

//Este esquema es oslo para decirle a mongodb como luciran mis datos
//aun no sabe como voy a crear el modelo

module.exports=mongoose.model('Note',NweSchemas);
                              //nombre y esquema        