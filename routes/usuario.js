const {Router} = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
// Esto reemplaza lo anterior
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} = require('../middlewares'); // Es igual que colocar '../middlewares/index'

const { validaRol, existeEmail, existeUsrPorId } = require('../helpers/db-validators');

const { usuarioGet, usuarioPost, usuarioPut, usuarioPatch, usuarioDelete } = require('../controllers/usuario');

const router = Router();

router.get('/', usuarioGet);

router.post('/', [
  check('nombre', 'Nombre no valido').not().isEmpty(),
  check('password', 'Password debe ser más de 6 letras').isLength({min: 6}),
  check('correo', 'Correo no valido').isEmail(),
  check('correo').custom( existeEmail ),
  //check('rol', 'Rol no valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  //check('rol').custom( (rol) => validaRol(rol) ), // Como los argumentos tienen mismo nombre debe quedar:
  check('rol').custom( validaRol ), // Como los argumentos tienen mismo nombre debe quedar:
  validarCampos
],usuarioPost );

router.put('/:id', [
  check('id','No es un ID valido').isMongoId(),
  check('id').custom(existeUsrPorId),
  check('rol').custom( validaRol ),
  validarCampos
], usuarioPut);

router.patch('/', usuarioPatch);

router.delete('/:id', [
  validarJWT,
  //esAdminRole ,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id','No es un ID valido').isMongoId(),
  check('id').custom(existeUsrPorId),
  validarCampos

], usuarioDelete);



module.exports = router;