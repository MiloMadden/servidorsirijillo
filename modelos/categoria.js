
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//==============================================================
let categoriaSchema = new Schema({
    descripcion: {
        type: String, 
        require: [true, 'La descripcion es necesario']
    }, 
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }
})
//==============================================================
module.exports = mongoose.model('Categoria', categoriaSchema);
//==============================================================
