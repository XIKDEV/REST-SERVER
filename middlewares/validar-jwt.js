const { request } = require('express')
const { response } = require('express')
const Usuario = require('../models/usuarios')
const jwt = require('jsonwebtoken')

const validarJWT = async(req = request, res = response, next) =>{
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No haz ingresado'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);
        // Validar si existe el usuario
        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe'
            })

        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'El usuario no esta habilitado'
            })
        }

        req.uid = usuario
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: 'Token no valido'})
    }

}

module.exports = {
    validarJWT
}