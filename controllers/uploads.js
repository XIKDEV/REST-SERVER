const { response } = require("express");
const { subirArchivo } = require("../helpers");
const path = require('path')
const fs = require('fs');
const cloudinary = require('cloudinary')
// Conifigurar la cuenta de cloudinary
cloudinary.config(process.env.cloudinary_url)

const {Usuarios, Producto} = require('../models');


const cargarArchivos = async(req, res = response) => {

    
    try {
        // Para mandar argumetnos por defecto, agregar undifined|
        const nombre = await subirArchivo(req.files, undefined, 'textos');
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({msg})
    }
}


const actualizarImagen = async(req, res = resposne) => {
    
    const { id, coleccion} = req.params;

    let modelo;
    

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuarios.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
            break;
    }



    //Limpiar imagenes previas
    try {
        if(modelo.img){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {
        console.log(error)
    }
    
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    
    res.json({
        id,
        coleccion,
        modelo
    })
}
const actualizarImagenCloudinary = async(req, res = resposne) => {
    
    const { id, coleccion} = req.params;

    let modelo;
    

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuarios.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
            break;
    }



    //Limpiar imagenes previas
    
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.')

        // console.log(public_id)
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;


    
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo)
    
    // const nombre = await subirArchivo(req.files, undefined, coleccion);
    // modelo.img = nombre;
    // await modelo.save();
    
    // res.json({
    //     id,
    //     coleccion,
    //     modelo
    // })
}

const mostrarImagen = async(req, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;
    

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuarios.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
            break;
    }

    //Limpiar imagenes previas
    if(modelo.img){
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        
        if (fs.existsSync(pathImagen)){
            return res.sendFile( pathImagen)
        }
    }
    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathNoImagen)
    
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}