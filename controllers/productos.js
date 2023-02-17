const { response } = require('express');
const { Result } = require('express-validator');
const {Producto, } = require('../models')



const obtenerProducto = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}
    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        // total,
        // usuarios
        total, 
        producto
    })
}

const obtenerProductoId = async(req, res = response) => {
    const id = req.params.id;

    const {nombre, precio, estado, categoria, descripcion} = await Producto.findById(id);

    if(!estado){
        res.status(401).json({
            msg: 'El producto no existe'
        })
    }

    res.status(201).json({
        nombre,
        precio,
        categoria,
        descripcion
    })
}


const registrarProducto = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const {precio, categoria, descripcion} = req.body;

    const producto = await Producto.findOne({nombre});
    if(producto){
        res.status(400).json({
            msg: `El producto ${nombre} ya esta registrado`
        })
    }

    // const categoriaF = await Categoria.findById(categoria);
    // if(!categoriaF){
    //     res.status(400).json({
    //         msg: `La categoria ${categoriaF} no existe`
    //     });
    // }

    const data = {
        nombre,
        usuario: req.uid._id,
        categoria,
        precio,
        descripcion
    }
    
    const produc = new Producto(data)

    await produc.save();

    res.status(201).json(produc)

}

const actualizarProducto = async(req, res = response) => {
    const id = req.params.id;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.uid._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        producto
    })

}

const eliminarProducto = async(req, res = response) => {
    const {id} = req.params;

    await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(id)
}

module.exports = {
    registrarProducto,
    obtenerProducto,
    obtenerProductoId,
    actualizarProducto,
    eliminarProducto
}