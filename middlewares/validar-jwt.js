const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res =response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msj: 'No hay token en la petición'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer usuario que corresponde al uid
        const usrAut = await Usuario.findById(uid);
        // Verificar que usuario existe.
        if (!usrAut) {
            return res.status(401).json({
                msj: 'Token no valido - Usuario no existe'
            });
        }
        // Verificar que uid esté vigente
        if (!usrAut.estado) {
            return res.status(401).json({
                msj: 'Token no valido - Usuario no vigente'
            });
        }
        req.usuario = usrAut;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msj: 'Token no valido'
        });
        
    }
}

module.exports = {
    validarJWT
}