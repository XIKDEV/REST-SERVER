const { response } = require("express");
const { Categoria } = require('../models')

const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB){
        res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }
    // Genearar la data a guardar

    const data = {
        nombre,
        usuario: req.uid._id
    }

    const categoria = new Categoria(data);

    // GUARDAR EN DB
    await categoria.save();

    res.status(201).json(categoria);
}

const obtenerCategorias = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}
    const [total, categoria] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        // total,
        // usuarios
        total, 
        categoria
    })

}

const obtenerCategoriasId = async(req, res = response) => {
    const id = req.params.id;

    const {nombre, estado, usuario} = await Categoria.findById(id).populate('usuario','nombre')

    if(!nombre){
        res.status(401).json({
            msg: `No se logro encontrar la categoria: ${nombre}`
        })
    }

    if(!estado){
        res.status(401).json({
            msg: 'La categoria no existe'
        })
    }

    res.status(200).json({
        nombre, estado, usuario
    })
}

const eliminarCategoria = async(req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    const usuarioAuth = req.uid

    res.json({
        categoria,
        usuarioAuth
    })
}

const actualizarCategoria = async(req, res= response) => {
    const id = req.params.id;
    const {estado, usuario, ...resto} = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.uid._id;

    const categoria = await Categoria.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        categoria
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasId,
    eliminarCategoria,
    actualizarCategoria
}