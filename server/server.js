        require('./config/config');
        const express = require('express');
        const app = express();
        const mongoose = require('mongoose');
//-----------------------------------------------------------
        const bodyParser = require('body-parser');

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))
        
        // parse application/json
        app.use(bodyParser.json())
//-----------------------------------------------------------
        // RUTAS
        const rutas = require('../rutas/index')

        //MIDDLEWARE DE RUTAS
        app.use(rutas)

//-----------------------------------------------------------
/*const nube ="mongodb+srv://MiloMadden:cebollitasi77@cluster0-2ntwx.mongodb.net/megumi?retryWrites=true&w=majority";

const local = 'mongodb://localhost:27017/megumi';*/

let localito = 'mongodb://localhost:27017/megumi';

        mongoose.connect(localito, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false } , (err)=>{
        if(err) throw err;
        console.log('Conectado a la base de datos')
        }) 
        
        app.listen(3000, ()=>{
            console.log('corriendo');
            //console.log(process.env);
        })
//------------------------------------------------------------