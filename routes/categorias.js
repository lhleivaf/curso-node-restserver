const {Router} = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { crearCategoria, obtenerCatagorias, borrarCategoria, obtenerCatagoria, actualizarCategoria } = require('../controllers/categorias');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las catogerias - publico
router.get('/', obtenerCatagorias);

// Obtener una catogeria por id - publico
router.get('/:id', [
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCatagoria);

// Crear catogeria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria
);

// Actualiza catogeria - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una catogeria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;
