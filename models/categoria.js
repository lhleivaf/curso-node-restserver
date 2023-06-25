const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: { type: String, require: [true, 'Nombre obligatorio'], unique: true },
    estado: { type: Boolean, default: true, require: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', require: true }
});


CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...reg} = this.toObject();
    return reg;
};



module.exports = model('Categoria', CategoriaSchema);


