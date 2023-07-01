const { response, request, json } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');
const categoria = require("../models/categoria");

const colecciones = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscaUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        //return res.json((usuario)?[usuario]:[]);
        return res.json({results: (usuario)?[usuario]:[]});
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({ results: usuarios});
}

const buscaCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const Categoria = await Categoria.findById(termino);
        return res.json({results: (categoria)?[categoria]:[]});
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({ results: categorias});
}

const buscaProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({results: (producto)?[producto]:[]});
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre');

    res.json({ results: productos});
}

const buscar = (req = request, res = response) => {
    const {coleccion, termino} = req.params;

    if (!colecciones.includes(coleccion)) {
        return res.status(400).json({
            msj: `Las colecciones permitidas son: ${colecciones}`
        });
    }

    switch(coleccion) {
        case 'categorias':
            buscaCategorias(termino, res);
            break;
        case 'productos':
            buscaProductos(termino, res);
            break;
        case 'usuarios':
            buscaUsuarios(termino, res);
            break;
        default:
            res.status(500).json({msj: 'Colección no habilitada su búsqueda'});
    }

}


module.exports = {
    buscar
}