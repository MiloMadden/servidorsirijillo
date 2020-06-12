require('../server/config/config')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../modelos/usuario');
//---------------------------------------------

app.post('/login', (req,res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{

        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if(!usuarioDB)return res.status(400).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })

        if ( !bcrypt.compareSync(body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok:false, 
                msg: 'Contraseña no valida'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_DESARROLLO, {
            expiresIn: process.env.VENCIMIENTO_TOKEN
        })

        res.json({
            ok: true, 
            msg: 'Bienvenido', 
            usuario: usuarioDB, 
            token
        })
    })

})


//---------------------------------------------
module.exports = app;