const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0/notes-db-app', { 
    //aqui se pondria tambien la dirección de una db en la nube o 127.0.0.1 tambien da un local
    //configuración, en las ultimas versiones lo pide
    useNewUrlParser: true,
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));
