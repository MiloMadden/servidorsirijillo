
const express = require('express');
const { verificaToken } = require('../server/middlewares/autenticacion');

const app = express();
const Categoria = require('../modelos/categoria');
//--------------------------------------------------------------------------

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res)=>{

    Categoria.find({})
             .sort('descripcion')
             .populate('usuario', 'nombre email')
             .exec((err, categorias)=>{
                if(err)return res.status(500).json({
                    ok: false, 
                    err
                })  

                if(!categorias)return res.json({
                    ok: false, 
                    msg: "No hay Categorias"
                })

                res.json({
                    ok: true, 
                    categorias
                })
             })

})

// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res)=>{
    // Categoria.findById(...........)
    let id = req.params.id;

    Categoria.findById(id, (err, categoria)=>{
        
        if(err)return res.status(500).json({
            ok: false, 
            err
        })
        
        if(!categoria)return res.status(404).json({
            ok: false, 
            msg: 'No se encontro esta categoria'
        })

        res.json({
            ok: true, 
            categoria
        })
    })
})

//=======================================================================
// Crear nueva categoria
app.post('/categoria', verificaToken,(req, res)=>{
    // regresa nueva categoria
    // req.usuario._id
    let usuarioId = req.usuario._id;
    //let descripcion = req.body.descripcion;

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: usuarioId
    });

    Categoria.findOne({descripcion: req.body.descripcion}, (err, categoGuardada)=>{
        
        if(err)return res.status(500).json({
            ok: false, 
            err
        })  
        
        if(categoGuardada){
            return res.json({
                ok: false,
                msg: `Ya existe la categoria: ${categoGuardada.descripcion}`
            })
        }else{
            
            categoria.save((err, categoriaDB)=>{
    
                if(err)return res.status(500).json({
                    ok: false, 
                    err
                })
        
                if(!categoriaDB)return res.status(404).json({
                    ok: false, 
                    msg: 'No se pudo guardar categoria'
                })
        
                res.json({
                    ok: true, 
                    categoria: categoriaDB
                })
        
            })   

        }
    })
       
})
//=============================================================

// Modificar Categoria
app.put('/categoria/:id', verificaToken, (req, res)=>{
    
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new:true}, (err, categoDB)=>{
       
        if(err)return res.status(500).json({
            ok: false, 
            err
        })
        
        if(!categoDB)return res.status(404).json({
            ok: false, 
            msg: "No se encontro la categoria"
        })

        res.json({
            ok: true, 
            modificado: categoDB
        })
    })
    
})

// Borrar Categoria
app.delete('/categoria/:id', verificaToken,(req, res)=>{

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria)=>{
        
        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if(!categoria)return rea.status(404).json({
            ok: false, 
            msg: 'Categoria no encontrada'
        })

        res.json({
            ok: true, 
            eliminada: categoria
        })
    })

})

//--------------------------------------------------------------------------
module.exports = app;
//--------------------------------------------------------------------------