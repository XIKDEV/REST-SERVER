const { request } = require('express');
const {response}  = require('express')

const validarRoles = (req = request, res = response, next) => {

    if(!req.uid) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const {rol, nombre} = req.uid;

    if ( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es admin`
        })
    }
    
    next();
}


const tieneRole = (...resto) => {
    return (req, res = response, next) => {
        // console.log(resto, req.uid.rol)
        if(!req.uid) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if( !resto.includes(req.uid.rol)){
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${resto}`
            })
        }

        next();
    }
}
module.exports = {
    validarRoles,
    tieneRole
}