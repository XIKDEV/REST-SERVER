const Roles = require('../models/role')
const Usuario = require('../models/usuarios')
const Categoria = require('../models/categoria')
const colors = require('colors')
const { Producto } = require('../models')

const esRoleValido = async(rol = '') =>{
    const existeRol = await Roles.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const esCorreoUnique = async(correo = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}
const existeUsuarioId = async(id) => {
    //verificar si el correo existe
    const existeId = await Usuario.findById(id)
    if (!existeId){
        throw new Error(`El correo ${existeId} ya esta registrado`)
    }
}

const existeCategoriaId = async(id) => {
    // Validar si existe por id
    const existeCat = await Categoria.findById(id);
    if(!existeCat){
        throw new Error(`La categoria con id: ${id}, no existe`)
    }
}

const existeProductoId = async(id) => {
    // Validar si existe por id
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`La categoria con id: ${id}, no existe`)
    }
}

// const existeCategoria = async(nombre = '') => {
//     // Validar si existe por id
//     const existeCat = await Categoria.findOne({nombre});
//     if(!existeCat){
//         throw new Error(`La categoria ${nombre} no existe`)
//     }
// }

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}



module.exports = {
    esRoleValido,
    esCorreoUnique,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas
}