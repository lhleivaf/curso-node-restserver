const Role = require('../models/role');
//const Usuario = require('../models/usuario');
const { Usuario, Categoria, Producto } = require('../models');


const validaRol = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
 };

 const existeEmail = async(correo='') => {
    const existeEmail = await Usuario.findOne({correo});
     // Validar si correo existe.
     if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos`);
    }
 };

 const existeUsrPorId = async(id) => {
    const existeUsr = await Usuario.findById(id);
     // Validar si correo existe.
     if (!existeUsr) {
        throw new Error(`No existe usuario para ID=${id} en la base de datos`);
    }
 };

 const existeCategoriaPorId = async(id) => {
    const existeCateg = await Categoria.findById(id);
     // Validar si existe.
     if (!existeCateg) {
        throw new Error(`No existe categoria para ID=${id} en la base de datos`);
    }
 };

 const existeProductoPorId = async(id) => {
    const existeProd = await Producto.findById(id);
     // Validar si existe.
     if (!existeProd) {
        throw new Error(`No existe producto para ID=${id} en la base de datos`);
    }
 };

module.exports = {
    validaRol,
    existeEmail,
    existeUsrPorId,
    existeCategoriaPorId,
    existeProductoPorId
}

