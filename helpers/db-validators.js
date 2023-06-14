const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    validaRol,
    existeEmail,
    existeUsrPorId
}

