require('../server/config/config')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../modelos/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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
// configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);

    return {
        nombre: payload.name,
        email: payload.email,
        google: true
    }

  }

app.post('/google', async(req, res)=>{
    
    let token = req.body.tokenGoogle;

    let googleUser = await verify(token)
                    .catch(e=>{
                        return res.status(403).json({
                            ok: false,
                            error: e
                        })
                    })

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        
        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if( usuarioDB ){
            
            if(usuarioDB.google === false){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'debe usar su autenticacion normal'
                    }
                })
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_DESARROLLO, {
                    expiresIn: process.env.VENCIMIENTO_TOKEN
                });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{
            // si el usuario no existe en nuestra base de datos
            let user = new Usuario();
            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.google = googleUser.google;
            user.password = ':)';

            user.save((err, usuarioDB)=>{
                
                if(err)return res.status(500).json({
                    ok: false, 
                    err
                })

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_DESARROLLO, {
                    expiresIn: process.env.VENCIMIENTO_TOKEN
                });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
})

//---------------------------------------------
module.exports = app;