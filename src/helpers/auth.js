const helpers={};

helpers.isAuthenticated=(req,res,next)=>{//le puedo poner squi cualquier nombre, no tiene que ser is Authenticated
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','You must be logged in');
    res.redirect('/users/signin');
    //si e usuario no esta autenticado, redirecciono a la pagina de ingreso, no tiene acceso a as demas vistas
};


module.exports=helpers;