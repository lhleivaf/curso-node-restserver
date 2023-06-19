const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const {correo, password} = req.body;
    try {
        // Verificar correo en BD
        const usr = await Usuario.findOne({correo});
        if (!usr) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Validar usuario activo
        if (!usr.estado) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Verificar contraseña
        
        const validaClave = bcryptjs.compareSync(password, usr.password);
        if (!validaClave) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Generar el JWT
        const tkn = await generarJWT(usr.id);

        res.json({usr, tkn});
    } catch (error) {
        console.log(error);
        res.status(500).json({msj: 'Hable con el administrador'});
    }
}

module.exports = {
    login
}