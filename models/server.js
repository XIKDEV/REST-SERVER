const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')

class Server {

    constructor(){
        //servicios del rest server
        this.app = express()
        this.host = process.env.host
        this.port = process.env.port
        this.paths = {
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        };
        // Conectar a base de datos
        this.conectarDB();
        // Middlewares
        this.middlewares()
        // Rutas
        this.routes();
        

    }

    async conectarDB() {
        await dbConnection()
    }
    // Función que se ejecuta antes de hacer una petición
    middlewares(){
        // cors
        this.app.use(cors())
        // Lectura y parseo del body
        this.app.use(express.json())
        // Directorio estatico (publico)
        this.app.use( express.static('public'));
        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        // Rutas de usuarios
        this.app.use(this.paths.usuarios, require('../routes/user'))
        // Rutas para login
        this.app.use(this.paths.auth, require('../routes/auth'))
        // Rutas para Categorias
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        // Rutas para productos
        this.app.use(this.paths.productos, require('../routes/productos'))
        // Ruta para buscar
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        // Ruta para cargar archivos
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    listen(){
        this.app.listen(this.port, this.host, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
          
    }
}

module.exports = Server