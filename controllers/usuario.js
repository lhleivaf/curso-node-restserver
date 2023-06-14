const {request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuarioGet = async(req = request, res = response) => {
    const {limite=5, desde=0} = req.query;
    const qryEstado = {estado: true};

    //const usrs = await Usuario.find() // Retorna todos
    // const usrs = await Usuario.find(qryEstado) // Retorna solo segun estado
    //     .skip(Number(desde))
    //     .limit(Number(limite))
    //     ;

    // const  totalRegBD = await Usuario.countDocuments(qryEstado);

    const [totalRegBD, usuarios] = await Promise.all([
        Usuario.countDocuments(qryEstado),
        Usuario.find(qryEstado)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({totalRegBD, usuarios});
};
// const usuarioGet = (req = request, res = response) => {
//     const {q,nombre,apikey,page=1,limit=10} = req.query;
//     res.json({msg: 'get API - controlador', 
//         q, nombre, apikey, page, limit
//     });
// };

const usuarioPost = async (req = request, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usr = new Usuario({nombre, correo, password, rol});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usr.password = bcryptjs.hashSync(password, salt);
    
    // Guardar en BD
    await usr.save();

    // Retorno
    res.json(usr);
};
// const usuarioPost = async (req = request, res = response) => {
//     // //const body = req.body;
//     // //res.status(201).json({msg: 'post API - controlador', body});
//     // const {nombre,edad} = req.body;
//     // res.status(201).json({msg: 'post API - controlador', nombre, edad});

//     // const body = req.body;
//     // const usr = new Usuario(body);

//     const {nombre, correo, password, rol} = req.body;
//     const usr = new Usuario({nombre, correo, password, rol});

//     // Ya no va aqui esta validacion
//     // // Validar si correo existe.
//     // const existeCorreo = await Usuario.findOne({correo});
//     // if (existeCorreo) {
//     //     return res.status(400).json({
//     //         msg: 'El correo ya existe'
//     //     });
//     // }

//     // Encriptar contraseña
//     const salt = bcryptjs.genSaltSync();
//     usr.password = bcryptjs.hashSync(password, salt);
    
//     // Guardar en BD
//     await usr.save();

//     // Retorno
//     res.json(usr);
// };

const usuarioPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if (password) { // Se debe cambiar
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usr = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usr);
    //res.json({msg: 'put API - controlador', usr});
};
// const usuarioPut = (req = request, res = response) => {
//     //const id = req.params.id;
//     const {id} = req.params;

//     res.json({msg: 'put API - controlador', id});
// };

const usuarioPatch = (req = request, res = response) => {
    res.json({msg: 'patch API - controlador'});
};

const usuarioDelete = async(req = request, res = response) => {
    const {id} = req.params;

    // // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Dejar no vigente para poder eliminar logicamente el registro.
    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});


    res.json(usuario);
};

module.exports = {
    usuarioGet, usuarioPost, usuarioPut, usuarioPatch, usuarioDelete
};
