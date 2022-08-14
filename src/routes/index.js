//URL O RUTAS PRINCIPALES
//const router=require('express').Router();
const express=require('express');
const router=express.Router();

//router es un enrutador que sirve para crear ruitas del servidor

router.get('/',(req,res)=>{
    res.render('partials/index',{
        style:'main.css'
    })//no es necesario que tenga .hbs ya que ya se configuró el motor de plantillas
});//el primer argumento es el path, el segundo es una funcion que recibe req y res
//si no funciona poner la ruta completa '../views/partials/index.hbs'

//se supone que al indicar a views como carpeta predeterminada en la configuración del
//motor de plantillas, ya no es necesario indicar la ruta completa, solo la carpeta interna en views y el archivo
//que se quiere renderizar

router.get('/about',(req,res)=>{
    res.render('partials/about',{
        style:'main.css'
    })
});

module.exports=router;

//hat dos formas de usar el css en las plantillas de las vistas

//la primera es en el html poner 
//<link rel="stylesheet" href="css/{{style}}"> 

//y en las rutas donde quiero renderizar poner la estructura
/*
router.get('/',(req,res)=>{
    res.render('partials/index',{
        style:'main.css'
    })//no es necesario que tenga .hbs ya que ya se configuró el motor de plantillas
});

*/

//es decir en el html pongo el nombre que le di al objeto que agregue a las rutas
// y en archivo js que crea las rutas a ese objeto le asigno el nombre del archivo que contiene los estilos
//que quiero usar en esas rutas, este metodo es util para usar multiples archivos css
// en diferentes rutas ya que a ese mismo objeto "style" se le pueden asignar diferentes archivos css.

//ej:
/*
router.get('/about',(req,res)=>{
    res.render('partials/about',{
        style:'main2.css'
    })

});
*/