const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const {Usuario, Producto} = require('../models');
const { model } = require("mongoose");

//const cargarArchivo = (req = request, res = response) => {
const cargarArchivo = async(req = request, res = response) => {

/* Reemplazado por middlewares validarArchivoSubir
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msj: 'No hay archivos que subir'});
        return;
    }
*/

    // // Imagenes
    // //const pathArch = await subirArchivo(req.files);
    // //res.json({path: pathArch});
    // const nomArch = await subirArchivo(req.files);
    // res.json({nombre: nomArch});

    try {
        // // Txt, md
        // const nomArch = await subirArchivo(req.files, ['txt','md'], 'textos');
        // Imagenes
        const nomArch = await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre: nomArch});
    } catch (msj) {
        res.status(400).json({msj});
    }





/* Se pasa a Helpers 27/06/2023
    const {archivo} = req.files;
    const nombreCortado = archivo.name.split('.');
//    console.log(nombreCortado);
    const extension = nombreCortado[nombreCortado.length-1];

    // Validar extensiones
    const extValidas = ['png','jpg','jpeg','gif'];
    if (!extValidas.includes(extension)) {
        res.status(400).json({msj: `La extension ${extension} no es permitida, (${extValidas})`});
        return;
    }

    const nombreTemp = uuidv4() + '.' + extension;

    const uploadPath = path.join(__dirname, '../uploads/', nombreTemp);

    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({err});
        }
        res.json({msj: 'Archivo subido a ' + uploadPath});
    });
*/

}

// En el curso se reemplaza "actualizaImagen" por "actualizaImagenCloudinary"
const actualizaImagen = async(req = request, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe usuario con id = ${id}`});
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe producto con id = ${id}`});
            }
            break;
        default:
            return res.status(500).json({msj: 'Esta colección no está implementada'});
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }
    const nomArch = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nomArch;
    await modelo.save();
    
    res.json(modelo);
}

const mostrarImagen = async(req = request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe usuario con id = ${id}`});
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe producto con id = ${id}`});
            }
            break;
        default:
            return res.status(500).json({msj: 'Esta colección no está implementada'});
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }
    
    const pathImgSin = path.join(__dirname,'../assets/no-image.jpg');
    if (pathImgSin) {
        res.sendFile(pathImgSin);
    } else {
        res.json({msj: 'Falta place holder'});
    }
}

// En el curso se reemplaza "actualizaImagen" por "actualizaImagenCloudinary"
const actualizaImagenCloudinary = async(req = request, res = response) => {
    const {id, coleccion} = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe usuario con id = ${id}`});
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({msj: `No existe producto con id = ${id}`});
            }
            break;
        default:
            return res.status(500).json({msj: 'Esta colección no está implementada'});
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Borrar imagen de cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    // Subir imagen a Cloudinary
    const {tempFilePath} = req.files.nomArch;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    // Subir a BD
    modelo.img = secure_url;
    await modelo.save();
    
    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizaImagen,
    mostrarImagen,
    actualizaImagenCloudinary
}
