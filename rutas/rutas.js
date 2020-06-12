
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();

const { verificaToken, verificaAdmin } = require('../server/middlewares/autenticacion');

const Usuario = require('../modelos/usuario');
//-------------------------------------

app.post('/usuario', (req, res)=>{

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre, 
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });

    usuario.save( (err, usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: false, 
                error: err
            })
        }

        res.json({
            ok: true,
            msg: 'Usuario Guardado con Exito', 
            usuario: usuarioDB
        })

    } )
})

//-------------------------------------

app.put('/usuario/:id?', (req, res)=>{

    let update = _.pick(req.body, ['nombre', 'email']);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, update, {new:true /*runValidators:true*/}, (err, userUpdated)=>{
        if(err)return res.status(400).json({
            ok: false, 
            message: 'Error en la peticion', 
            err
        }) 

        if(!userUpdated)return res.status(400).json({
            ok: false, 
            message: 'No existe el usuario'
        })

        res.json({
            ok: true, 
            updated: userUpdated
        })
    })
})
//-------------------------------------

app.get('/usuario', [verificaToken, verificaAdmin], (req, res)=>{

    let perfil = req.usuario;

    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado:true}, 'nombre email')
           .skip(desde)
           .limit(limite)
           .exec((err, usuarios)=>{
               if(err)return res.status(400).json({
                   ok: false, 
                   err
               })

               Usuario.countDocuments({estado:true}, (err, conteo)=>{
                   
                    res.json({
                        ok: true,
                        conteo,
                        perfil: perfil.nombre, 
                        usuarios
                    })
               })


           })

})
//-------------------------------------
// hay 2 formas de borrar
// forma 1 - borrar registro fisico

app.delete('/usuario/:id?', (req, res)=>{

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, userRemoved)=>{
        
        if(err)return res.status(400).json({
            ok: false, 
            err
        })

        if(!userRemoved)return res.status(404).json({
            ok: false, 
            message: 'Usuario no encontrado'
        })

        res.json({
            ok: true, 
            usuario: userRemoved
        })
    })

})

// forma 2 - estado false (inhabilitar sin borrar)

app.put('/deshabilitar/:id?', (req, res)=>{

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado:false}, {new:true}, (err, usuarioActualizado)=>{

        if(err)return res.status(400).json({
            ok: false, 
            err
        })

        if(!usuarioActualizado)return res.status(404).json({
            ok:false, 
            message: 'Usuario no encontrado'
        })

        res.json({
            ok:true,
            usuario: usuarioActualizado
        })

    })

})



//-------------------------------------
module.exports = app;
