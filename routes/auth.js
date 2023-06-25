const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'Correo obligatorio').isEmail(),
    check('password', 'Password obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'id_token de google obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;
