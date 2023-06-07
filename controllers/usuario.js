const {request, response} = require('express');

const usuarioGet = (req = request, res = response) => {
    const {q,nombre,apikey,page=1,limit=10} = req.query;

    res.json({msg: 'get API - controlador', 
        q, nombre, apikey, page, limit
    });
};

const usuarioPost = (req = request, res = response) => {
    //const body = req.body;
    //res.status(201).json({msg: 'post API - controlador', body});
    const {nombre,edad} = req.body;
    res.status(201).json({msg: 'post API - controlador', nombre, edad});
};

const usuarioPut = (req = request, res = response) => {
    //const id = req.params.id;
    const {id} = req.params;

    res.json({msg: 'put API - controlador', id});
};

const usuarioPatch = (req = request, res = response) => {
    res.json({msg: 'patch API - controlador'});
};

const usuarioDelete = (req = request, res = response) => {
    res.json({msg: 'delete API - controlador'});
};

module.exports = {
    usuarioGet, usuarioPost, usuarioPut, usuarioPatch, usuarioDelete
};
