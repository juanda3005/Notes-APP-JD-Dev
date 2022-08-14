//passport local no solo permite autenticar, 
//tambien permite almacenar los datos de un usuario en una sesión para no tener 
//que estar pediendo a cada momento los datos del usuario

const passport= require('passport');//importo passport
//passport da opciones para autenticar con google, github , etc

//pero en este caso quiero hacer una autenticación local
const LocalStrategy=require('passport-local').Strategy;//importo passport-local, pero solo quiero su estrategia de autenticación
//passport-local es una libreria que permite autenticar con una estrategia local

const User=require('../models/User');//importo el modelo de usuario, 
//ya que necesito consultar si existen en la base de datos

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async  function (email, password, done) {
        // Match Email's User
        const user = await User.findOne({ email: email });
  
        if (!user) {
          return done(null, false, { message: "Not User found." });
        }
  
        // Match Password's User
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect Password." });
        
        return done(null, user);
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });






/*passport.use(new LocalStrategy({
    usernameField:'email'//el nombre del campo que se usa para el email
}, async {email,password,done} =>{//done actua como un callback, es una funcion que se ejecuta cuando se termina de hacer la tarea
    //aqui debo verificar si los datos estan en la base de datos
    const user=  User.findOne({email:email});//busco el correo del usuario en la base de datos
    //le asigno como variable usuario, ya que el correo en si representa a un usuario en la base de datos

    if(!user){//si no existe el correo en la base de datos
        return done(null,false,{ message:"Not User found."});// lammo al callback done que sirve para determinar el proceso de autenticación       
        //null significa que no hay error, false que no se encontró el correo, y luego pongo un mensaje de usuario no encontrado)
    

    //si el usuario existe, verifico si la contraseña es correcta
    }else{
        const match =  User.matchPassword(password);//uso la funcion matchPassword para verificar si la contraseña es correcta, retorna true or false

    //si correo y contraseña es correcto devuelvo el usuario
    if(macth) {
        return done(null,user);//si la contraseña es correcta, retorno el usuari
                    //(indico que no hay error, devuelvo el usuario)
    }
    //si la contraseña no es correcta?
    else{
        return done(null,false,{message:"Incorrect Password"});
        //null significa que no hay error, false que no se encontró el correo/usuario, y luego pongo un mensaje de contraseña incorrecta)
    }
    }
}));



//almaceno el usuario en una sesion

passport.serializeUser((user,done)=>{//serializeUser es una funcion que se ejecuta cuando se autentica un usuario
    done(null,user.id);//el id del usuario se guarda en la sesion cuando se autentica, para que no vuelva al login cada vez que se abre la pagina
});

//hace un proceso inverso al metodo anterior, toma un id y genera un usuario para poder
//utilizar sus datos

//AMBOS METODOS SON PARA AMACENAR EL USUARIO EN LA SESION tanto serialize como deserialize

passport.deserializeUser((id,done)=>{//deserializeUser es una funcion que se ejecuta cuando se cierra la sesion
    User.findById(id,(err,user)=>{
        ///si hay un usuario en la sesion busco por id a ese usuario, si lo encuentro puedo obtener un error o 
        //puedo buscar el usuario con done
        done(err,user);//retorno el usuario con el callback done, de nuevo puedo encontrar un error o el usuario
      });  
      //esta sección se puede hacer con un async y aswait pero asi lo recomienda la documentación de passport
});
*/