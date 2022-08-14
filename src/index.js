const express=require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');//para usalo siempre debe ir despues del middleware session


//INITIALIZATIONS
const app=express();
require('./database');
require('./config/passport');//llamo el archivo que contiene el codigo de la autenticación en el sign in



//SETTIINGS

app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
 //path. join es un metodo del modulo path,
 //la constante __dirname es una constante que contiene el path del archivo actual  
 //ejemplo, en este archivo develve la carpeta src, y al estar en src lo puedo concatenar
 //con otro archivo

 app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    runtimeOptions: {                           
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    extname: '.hbs',
}));
   
app.set('view engine','.hbs');


//MIDDLEWARES
//sirve para mostrar mensajes de error o de exito entre vistas
//DEBE IR AL PRINCIPIO DE TODOS LOS MIDDLEWARES

app.use(express.urlencoded({extended:false}));
//urlencode sirve para cuando un formulario quiera enviarme datos, extended:false ya que no voy a recibir imagenes
//solo datos

app.use(methodOverride('_method'));//sirve para que en un formulario no solo se pueda usar post o get, que tambien se pueda usar put o delete
app.use(session({//sirve para autenticar al usuario y guardar sus datos
    secret:'mysecretapp',
    resave:true,
    saveUninitialized:true
}));

//ponerlo siempre luego de session
app.use(passport.initialize());
app.use(passport.session());//sirve para que passport sepa que usuario esta autenticado
app.use(flash());

//GLOBAL VARRIABLES

//variable que almacene los mensajes de flash
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');//se debe poner este nombre ya que los mensjaes flash de passport tienen este nombre
    //y de esta forma passport y flash se pueden comunicar para mostrar los mensajes, como 
    //el nombre error es diferente al usado para los demas que es errors, en la plantilla hbs se debe crear la condicion
    //para recorres esos mensajes
    res.locals.user=req.user || null;//si el usuario esta autenticado, lo guardo en la variable user, si no su valor sera nulo
    //cuando passport autentica un usuario,la informacipon del usuario lo guarda en un objeto dentro de request
    next()//asegurarse de poner el next para que se ejecute el codigo de abajo
});

//ROUTES

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));


//SERVER IS LISTENING

app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
});

