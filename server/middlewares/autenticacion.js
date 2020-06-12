
const jwt = require('jsonwebtoken');

//=====================
// VERIFICAR TOKEN
//=====================

let verificaToken = (req, res, next)=>{
    
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_DESARROLLO, (err, decoded)=>{

        if(err)return res.status(401).json({
            ok: false, 
            err
        })

        req.usuario = decoded.usuario;

        next();

    })
}

let verificaAdmin = (req, res, next)=>{

    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE' ){
        next()
    }else{
        res.json({
            ok: false, 
            msg: 'El usuario no es administrador'
        })
    }

}

module.exports = {
    verificaToken, 
    verificaAdmin
}