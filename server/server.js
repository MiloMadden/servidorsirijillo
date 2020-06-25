        require('./config/config');
        const express = require('express');
        const app = express();
        const mongoose = require('mongoose');
        const path = require('path');
        //const passport = require('passport');
//-----------------------------------------------------------
        const bodyParser = require('body-parser');

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))
        
        // parse application/json
        app.use(bodyParser.json())
//-----------------------------------------------------------
        // Habilitar Public
        app.use( express.static( path.resolve(__dirname, '../public') ) )
//-----------------------------------------------------------
        // RUTAS
        const rutas = require('../rutas/index')

        //MIDDLEWARE DE RUTAS
        app.use(rutas)
//-----------------------------------------------------------


//-----------------------------------------------------------

let localito = 'mongodb://localhost:27017/megumi';

        mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false } , (err)=>{
        if(err) throw err;
        console.log('Conectado a la base de datos')
        }) 
        
        app.listen(3000, ()=>{
            console.log('corriendo');
            //console.log(process.env);
        })
//------------------------------------------------------------