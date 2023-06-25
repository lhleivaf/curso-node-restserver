const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto
);

// Actualiza producto - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;
