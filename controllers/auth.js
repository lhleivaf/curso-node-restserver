const {request, response, json} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {
    const {correo, password} = req.body;
    try {
        // Verificar correo en BD
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Validar usuario activo
        if (!usuario.estado) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Verificar contraseña
        const validaClave = bcryptjs.compareSync(password, usuario.password);
        if (!validaClave) {
            return res.status(400).json({msj:'Usuario/Password no son correctos'});
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({usr: usuario, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({msj: 'Hable con el administrador'});
    }
}

const googleSignIn = async(req = request, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        // const googleUsr = await googleVerify(id_token);
        // console.log(googleUsr);

        let usuario = await Usuario.findOne({correo});
        // Usuario no existe, se debe crear
        if (!usuario) {
            // Crear
            const dataUsr = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'ADMIN_ROLE',
                google: true
            }
            console.log(dataUsr); // YOX
            usuario = new Usuario(dataUsr);
            await usuario.save();
        }

        // Usuario en BD No vigente
        if (!usuario.estado) { 
            return res.status(401).json({
                msj: 'Comuniquese con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({usuario, token });

        // res.json({
        //     msj: 'Vamos bien',
        //     id_token
        // });
    } catch (error) {
        console.log(`${error.name} - ${error.message}`);
        res.status(400).json({msj: 'El token yox no se pudo verificar'});
    }

}

module.exports = {
    login,
    googleSignIn
}