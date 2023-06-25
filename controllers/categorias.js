const { request, response } = require("express");

const {Categoria} = require('../models');

// CRUD para Catagorias

// obtenerCatagorias - paginado - total - populate
const obtenerCatagorias = async (req = request, res = response) => {
    const {limite=5, desde=0} = req.query;
    const qryEstado = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(qryEstado),
        Categoria.find(qryEstado)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({total, categorias})
}

// obtenerCatagoria - populate
const obtenerCatagoria = async (req = request, res = response) => {
    const {id} = req.params;
    // Obtener Categoria
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    // if (!categoria.estado) {
    //     return res.status(401).json({
    //         msj: 'Categoria bloqueada'
    //     });
    // }
    
    res.json(categoria);
}

// Crear Categoria
const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categDB = await Categoria.findOne({nombre});

    if (categDB) {
        return res.status(400).json({msj: `La categoria ${categDB.nombre} ya existe`});
    }

    // Generar registro a guardar
    const reg = {
        nombre,
        usuario: req.usuario._id
    }
    const categN = new Categoria(reg);

    // Guardar en BD
    await categN.save();

    // retornar
    res.status(201).json(categN);
}

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}

// borrarCategoria - estado = false
const borrarCategoria = async (req = request, res = response) => {
    const {id} = req.params;
    // Dejar no vigente
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new: true});
    res.json(categoria);
}



module.exports = {
    obtenerCatagorias,
    obtenerCatagoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
