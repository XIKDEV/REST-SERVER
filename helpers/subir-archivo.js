const path = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {


    return new Promise((resolve, reject) => {
        const {archivo} = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1]
    
        // Validar extensión
        if(!extensionesValidas.includes(extension)){

            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`)

        }
    
        // res.json({nombreCortado})
    
    // Carga y guarda archivos en el servidor
        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err)
            
            }
            resolve(nombreTemp);
        });
    })
    
}


module.exports = {
    subirArchivo
}