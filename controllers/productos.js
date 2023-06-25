const { request, response } = require("express");

const {Producto} = require('../models');

// CRUD para Productos

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const {limite=5, desde=0} = req.query;
    const qryEstado = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(qryEstado),
        Producto.find(qryEstado)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({total, productos})
}

// obtenerProducto - populate
const obtenerProducto = async (req = request, res = response) => {
    const {id} = req.params;
    // Obtener Producto
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    
    res.json(producto);
}

// Crear Producto
const crearProducto = async (req = request, res = response) => {
    const {estado, usuario, ...body } = req.body;

    const nombre = body.nombre.toUpperCase();
    const prodDB = await Producto.findOne({nombre});

    if (prodDB) {
        return res.status(400).json({msj: `El producto ${prodDB.nombre} ya existe`});
    }

    // Generar registro a guardar
    const reg = {
        ...body,
        nombre,
        usuario: req.usuario._id
    }
    const prodN = new Producto(reg);

    // Guardar en BD
    await prodN.save();

    // retornar
    res.status(201).json(prodN);
}

// actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

// borrarProducto - estado = false
const borrarProducto = async (req = request, res = response) => {
    const {id} = req.params;
    // Dejar no vigente
    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new: true});
    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
