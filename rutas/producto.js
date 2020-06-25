
const express = require('express');

const { verificaToken } = require('../server/middlewares/autenticacion');
const Producto = require('../modelos/producto');
const Categoria = require('../modelos/categoria');
const _ = require('underscore');

const app = express();


//================================================================================

//Obtener Productos

app.get('/productos', verificaToken, (req, res)=>{
    // traer todos los productos
    // popular usuario y categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);

        Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos)=>{

                if(err)return res.status(500).json({
                    ok: false, 
                    err
                }) 

                if(!productos)return res.status(404).json({
                    ok: false, 
                    msg: 'No hay productos' 
                })

                Producto.countDocuments({disponible:true}, (err, conteo)=>{
                    
                    if(err)return res.status(500).json({ok:false, err})

                    res.json({
                        No_productos: conteo,
                        productos
                    })
                })



            })

})

// Obtener producto por ID
app.get('/producto/:id', verificaToken, (req, res)=>{
    //populate: usuario categoria
    // Paginado
    let id = req.params.id;

    Producto.findById(id)
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'descripcion')
                    .exec((err, productoDB)=>{
                        if(err)return res.status(400).json({
                            ok: false, 
                            err
                        })
                
                        if(!productoDB)return res.status(404).json({
                            ok: false, 
                            msg: 'No existe este producto'
                        })
                
                        res.json({
                            ok: true, 
                            producto: productoDB
                        })
                    })
})
//-----------------------------------------------------------------------------
// Crear un producto
app.post('/producto', verificaToken, (req, res)=>{
    // grabar el usuario
    let usuarioId = req.usuario._id;
    // grabar una categoria del listado de categorias
    //let categoria = req.body.categoria;

    Categoria.findOne({descripcion: req.body.categoria}, (err, catego)=>{

        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if(!catego){
            return res.status(404).json({
                ok: false, 
                msg: 'No existe esta categoria'
            })
        }

        let producto = new Producto({
            nombre: req.body.nombre,
            precioUni: req.body.precioUni,
            descripcion: req.body.descripcion,
            disponible: req.body.disponible,
            categoria: catego._id,
            usuario: usuarioId
        }) 

        producto.save( (err, productoDB)=>{
            
            if(err)return res.status(500).json({
                ok: false, 
                err
            })

            if(!productoDB)return res.status(400).json({
                ok: false,
                msg: 'No se pudo guardar el producto', 
                err
            })

            res.json({
                ok: true, 
                guardado: productoDB
            })

        } )

    })


})
//-----------------------------------------------------------------------

// Actualizar Producto
app.put('/producto/:id', (req, res)=>{

    let id = req.params.id;
    let update = _.pick(req.body, ['nombre', 'descripcion']);

    Producto.findByIdAndUpdate(id, update, {new:true}, (err, actualizado)=>{

        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if(!actualizado)return res.status(404).json({
            ok: false, 
            msg: 'No se pudo actualizar', 
            err
        })

        res.json({
            ok: true, 
            actualizado
        })

    })

})

// Borrar Producto
app.delete('/producto/:id', (req, res)=>{

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new:true}, (err, actualizado)=>{
        
        if(err)return res.status(500).json({
            ok: false, 
            err
        })

        if(!actualizado)return res.status(404).json({
            ok: false, 
            msg: 'No se pudo actualizar', 
            err
        })

        res.json({
            ok: true, 
            borrado: actualizado
        })

    })

})

// Busqueda de producto

app.get('/producto/buscar/:busqueda', (req, res)=>{

    let busqueda = req.params.busqueda;

    let regExp = new RegExp(busqueda, 'i');

    Producto.find({nombre: regExp})
            .populate('categoria', 'descripcion')
            .exec((err, busquedaDB)=>{

                if(err)return res.status(500).json({
                    ok: false, 
                    err
                })

                if(!busquedaDB)return res.status(404).json({
                    ok: false, 
                    msg: '0 resultados'
                })

                res.json({
                    ok: true, 
                    resultado: busquedaDB
                })

            })

})



//================================================================================
module.exports = app;
//================================================================================