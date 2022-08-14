//URLS PARA QUE EL USSUARIO SE AUTENTIQUE O SE REGISTRE

//const router=require('express').Router();
const express=require('express');
const router=express.Router();

const User=require('../models/User');//requiero el modelo de almacenamiento de los datos de usuario

const passport=require('passport');//requiero passport para autenticar en el signin



//router es un enrutador que sirve para crear ruitas del servidor

//ruta para el ingreso de un usuario a la aplicación
router.get('/users/signin',(req,res)=>{
    res.render('users/signin.hbs',{
        style:'main.css'
    })
});//el primer argumento es el path, el segundo es una funcion que recibe req y res


//como  argumento authenticate 
//recibe ('local'), al usar localauthenticate se hace con este nombre al autenticar en la ruta             
router.post('/users/signin',passport.authenticate('local',{//esto tambien es una funcion callback
    successRedirect:'/notes',//si no hay errores lo redirecciona a la vista de notas
    failureRedirect:'/users/signin',//si hay errores lo redirecciona de nuevo a la vista ingreso de usuario
    failureFlash:true//para pode rmostrar los mensajes flash en la autenticacion
}));
                

//ruta para el registro de un usuario en la aplicación
router.get('/users/signup',(req,res)=>{
    res.render('users/signup.hbs',{
        style:'main.css'
    })
});

//ruta para el envio de los datos de un usuario registrado

router.post('/users/signup', async (req,res)=>{//tiene la misma ruta que que signup, sin embargo se puede usar
    //ya que se utilizan diferentes metodos http, por supuesto tambien se puede usar una ruta diferente
    const {name,email,password, confirm_password}=req.body;//extraigo variables del objeto obtenidoa partir del formulario

    const errors=[];//creo un arreglo de errores

    if (name.length<0){
        errors.push({text:'Please write a name'});
    };

    if (password!=confirm_password){//si las contraseñas no coinciden
        errors.push({text:'Passwords do not match'});//agrego un error al arreglo
    }
    if (password.length<4){//si la contraseña es menor a 4 caracteres
        errors.push({text:'Password must be at least 4 characters'});//agrego un error al arreglo

    }


    //renderizo la vista de nuevo pero con los erroresque el usuario haya cometido
    if (errors.length>0){//si hay errores
        res.render('users/signup',{errors,name,email,password,confirm_password,style:'main.css'});
        //ademas de la vista le envio los datos que habia colocado antes para que no tipee de nuevo
        // ademas, estos se deben poner como value en el hbs para que no se borren al mostrar los errores en la vista.
    

    }else{//si no hay errores, guardo el usuario en la base de datos

        //evitar que el usuario ingrese un email que ya esta en la base de datos

        const emailUser=await User.findOne({email:email});//busco el email en la base de datos, basicamente
        //uso el await cuando una tarea va a tomar tiempo para que nod ela haga de manera asincrona y no interummpa otros procesos
        if(emailUser){//si el emailUser existe( si ya esta en la base de datos)
            req.flash('error_msg','The email is already in use');//muestro un mensaje de error
            res.redirect('/users/signup');//redirecciono al usuario a la pagina de registro
        }

        
        //creo el objeto newUser para almacenar los datos 

        const newUser=new User({name,email,password});//creo un nuevo usuario con los datos que obtuve del formulario
        newUser.password= await newUser.encryptPassword(password);//cifro la contraseña con la funcion creada en el modelo User.js
        //(puedo usar las propiedades del objeto newUser, asi newUser.password, es decir que aqui solo cifro el password)
        await newUser.save();//guarda el usuario en la base de datos (con la contrasea ya cifrada)

        //muestro el mensjae de verificación
        req.flash('success_msg','You are registered');

        //redirecciono a la vista de ingreso, signin
        res.redirect('/users/signin');

    }

});

// Para cerrar sesión
//se debe hacer se esta forma ya que las nuevas versiones de passport piden una funcion callback
//para req.logout

router.get('/users/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // if you're using express-flash
      req.flash('success_msg', 'session terminated');
      res.redirect('/');
    });
  });
  



module.exports=router;

