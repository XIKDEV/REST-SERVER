const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuarios')

const login = async(req, res = response) => {
    const { correo, password} = req.body
    try {
        // Validar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -- correo'
            })
        }
        // sI EL USUARIO ESTA ACTIVO
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -- estado: false'
            })
        }

        // Valiadar pass
        const validatePass = bcryptjs.compareSync(password, usuario.password);
        // Generar el JWT
        const token = await generarJWT(usuario.id)
        
        if(!validatePass){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -- password'
            })
        }
        
        // Generar JWT
        
        res.json({
            msg: 'login OK',
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
    
}

const googleSingIn = async(req, res = response) => {
    const {id_token} = req.body
    
    try {
        const {correo, nombre, img} = await googleVerify(id_token);
        
        // Validar si exsite el correo
        let usuario = await Usuario.findOne({correo})
        if(!usuario){
            // creacion de usuario si no existe
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }
    // Si el usuario en DB
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }
        
        // Generar JWT
        const token = await generarJWT(usuario.id)
        
        // console.log(googleUser)
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    login,
    googleSingIn
}