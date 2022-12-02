//URLS PARA EL MANEJO DE NOTAS POR PARTE DEL USUARIO


//const router=require('express').Router();
const express=require('express');
const router=express.Router();

//utilizo el modelo creado en el arichivo Note
//con esta variable puedo crear, eliminar etc
//al crear un esquema se crea una cklase, Note es una clase
const Note=require('../models/Note');

const {isAuthenticated}=require('../helpers/auth');//requiero el helper de autenticacion, especificamente
//la funcion creada llamada isAuthenticated

//const {isAuthenticated}=require('../helpers/auth');//requiero el helper auth para redireccionar a la pagina de ingreso si no hay
//auteenticacion, requiero solo el metodo de autenticación, este metodo actua como un middleware 
//cada ruta que yo quiero autenticar le agrego este metodo.

//isAuthenticated es un metodo de passport que me dice si el usuario esta autenticado/logeado o no
// se la poongo a todas las rutas menos a home y about ya que lo que me permite este metodo es bloquear
//el acceso a varias paginas dependiendo si esta logeado o no

//ya toda la verificacion de que rutas para ver o no se hace en auth, si no esta logeado 
//siempre lo va redirigir a signin, si esta logeado puede acceder a las demas  rutas a las que cuales
// en este archivo les asigno el metodo isAuthenticated como middleware, es decir a las rutas que quiero 
//que vea solo si esta logeado le agrego isAuthenticated

//Todo esto se hace para que el usuario no tenga acceso a ciertas rutas si no esta logeado, visualmente
//se podria quitar las pestañas que tienen vinculo a esas rutas si un usuario esta logeado o no, pero el usuario
//podria tipear la url e igulmente tener acceso a esas rutas, asi que por eso se usa passport

//por otro lado se puede poner un condicional en la vista, en este caso navigation.hbs para que cuando le logee
//no se muestre el enlace a signin y signup ya que no es necesario si esta logeado, pero no tiene sentido
//bloquear la url a estas rutas, esto se hace mediante un condicional en navigation.hbs

//Y si el usuario no esta logeado visualmente le oculto el menú que le permite acceder a las notas en navigation.hbs, 
//a visualizarlas, crear, editar, etc
//pero en este caso si se debe bloquear tambien la url con passport ya que si no se ha autenticado no deberia poder 
//acceder a estas rutas

//Tambien hay una forma para no tener que poner el isAuthenticated en todas las rutas.

//router es un enrutador que sirve para crear ruitas del servidor


//Ruta para crear una nota
router.get('/notes/add',isAuthenticated,(req,res)=>{//isAuthenticated debe ponerse en ese orden, 
    //siempre antes de que se procese el contenido
    //de la ruta, ya que debe estar autenticado para poder acceder a la ruta
    res.render('notes/new-note',{
        style:'main.css'
    })
});

//Crear ruta para recibir datos ingresados en el formulario

router.post('/notes/new-note',isAuthenticated, async (req,res)=>{
    //esta ruta solo se crea en un principio para el desarrollo pero
    //luego se le redirije a una ruta que contiene una vista con sus notas creadas

    //recordar que este nombre no tiene //nada que ver con el nombre del archivo renderizado en el formulario del ingreso de las notas,
//esta ruta puede llamarse de cualquier forma, el html del formulario si
//debe contener esta ruta

    //el async es para indicar que en la funcion hay procesos asincronos
    //esto es para que se ejecuten varios procesos al mismo tiempo
    const {title,description}=req.body;//extraigo variables del objeto obtenidoa partir del formulario
    
    //crear un arreglo con los mensajes de error

    //error si el usuario no escribe un titulo desde el navegador
    const errors=[];
    if (!title){//si no hay titulo
        errors.push({text:'Please write a title'});
    }

    //si el usuario no escribe una descripción
    if (!description){
        errors.push({text:'Please write a description'});
    }

    //si hay errores que muestro en la vista?
    if (errors.length>0){
        res.render('notes/new-note',{
            //renderizo de nuevo para poder mostrale las alertas de los errores
            style:'main.css',
            errors,//muestro los errores respectivos
            title,//para que el usuario no tenga que volver a escribir el titulo
            description//para que lo usuario no tenga que volver a ingresar la descripción
        });


        //si no hay errores almaceno en la base de datos
    }else{
        const newNote=new Note({title,description});
        newNote.user=req.user.id;//asigno el usuario que creo la nota
        //cuando passport auntentica al usuario guardo los datos en req.user
        await newNote.save();//guardo la nota en la base de datos
        //guarda los datos en la base de datos, si no usara await y async podria usar  newNote.save().then() 
        //await es para que espere a que se termine de guardar los datos

        
        //Mostrar mensajes luego de guardar las notas

        //no tengo que pasar estos mensajes a la vista que estaba renderizando al igual que los erores
        //ya que ya creé una variable global de flash para mostrar los mensajes, es decir que recorro el
        //success-msg que que esta en el index principal, na hay necesidad de renderizar la vista messages.hbs
        req.flash('success_msg','Note added successfully')//puedo usar sucess-msg porque es una
        //variable global que esta en el index principal
        res.redirect('/notes');//redirecciona a la ruta /notes
    }
});

//crear ruta para mostrar las notas
router.get('/notes',isAuthenticated, async (req,res)=>{
    const notes= await Note.find({user:req.user.id}).sort({date:"desc"});
    //ordeno por fecha de creación, de forma descendente, y en finde le pido q
    //que solo muestres las notas pertenecientes al usuario logeado
    res.render('notes/all-notes',{notes,
        style:'main.css'});
});

//ruta para editar la nota
router.get('/notes/edit/:id',isAuthenticated, async (req,res)=>{
    const note= await Note.findById(req.params.id);//para que al editar la nota me muestra el contenido que esta tiene actualmente
    res.render('notes/edit-note',{note,
        style:'main.css'});
});

//Ruta y vista para actualizar la nota
router.put('/notes/edit-note/:id',isAuthenticated,async (req,res)=>{
    const {title,description}=req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});//actualizo los datos editados
    req.flash('success_msg','Note updated successfully');//muestro el mensaje de actualización exitosa
    res.redirect('/notes');//redirecciona a la vista donde estan todas las notas creadas
});//en el html edit-note.hbs se usa el metodo put para actualizar los datos mediante put, utlizando el boton hidden
//y la sintaxis respectiva pra una consulta, de lo contrario se podria utilizar ajax.


//ruta para borrar la nota
//al usar el override para sobreescribir el post con un delete ,al igual que se hizo al editar la nota, da error
// aqui solo se usa un ost y al interior de la funcion callback de la ruta se elimina la nota de la base de datos
router.post('/notes/delete/:id',isAuthenticated, async (req,res)=>{
    
    await Note.findByIdAndDelete(req.params.id);//elimino la nota de la base de datos
    req.flash('success_msg','Note deleted successfully');//muestro el mensaje de eliminación exitosa
    res.redirect('/notes');//redirecciona a la vista donde estan todas las notas creadas
    //console.log(req.params.id); muestro el dato borrado por consola¨
});



module.exports=router;