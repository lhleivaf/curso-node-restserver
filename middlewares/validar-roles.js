const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        res.status(500).json({
            msj: 'Se quiere verificar el role sin validar el token '
        });
    }
    const {rol, nombre} = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        res.status(401).json({
            msj: `${nombre} no es administrador`
        });

    }
    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            res.status(500).json({
                msj: 'Se quiere verificar el role sin validar el token '
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            res.status(401).json({
                msj: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}