const dbvalidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {  // ... -> Indica que expota todo su contenido
    ...dbvalidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
