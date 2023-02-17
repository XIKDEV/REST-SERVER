const { response } = require('express');
const { request } = require('express');
const bcrypt = require('bcryptjs')
const Usuarios = require('../models/usuarios');

// const {Response} = require('express')

// OBTENER DATOS DE LA BD
const usuariosGet = async(req= request, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);
    // {desesctructuración de objetos} [desestructuración de arreglos]
    const [total, usuarios] = await Promise.all([
        Usuarios.countDocuments(query),
        Usuarios.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        // total,
        // usuarios
        total, 
        usuarios
    })
}
//EDICIÓN DE DATOS
const usuariosPut = async(req, res) => {

    const id = req.params.id
    const { _id, password, google, correo, rol, ...resto } = req.body;

    // Validar contra base de datos
    if(password) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync()
        resto.password = bcrypt.hashSync( password, salt )
    }

    const usuario = await Usuarios.findByIdAndUpdate(id, resto)

    res.json({
        usuario
    })
}
// CREAR USUARIOS
const usuariosPost = async(req, res) => {
   

    const { nombre, correo, password, rol} = req.body;
    const usuario = new Usuarios({ nombre, correo, password, rol})
    
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync( password, salt )

    // Guardar en BD
    await usuario.save()

    res.json({
        usuario
    })
}


const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    const usuario = await Usuarios.findByIdAndUpdate(id, {estado: false})
    
    const usuarioAuth = req.uid

    res.json({
        usuario,
        // uid,
        usuarioAuth
    })
}


module.exports = {
        usuariosGet,
    usuariosDelete,
    usuariosPost,
    usuariosPut
}