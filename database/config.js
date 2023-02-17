const mongoose = require('mongoose')
const color = require('colors')

const dbConnection = async() => {

    try {
       
        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // UseFindAndModify: false
        })

        console.log('Base de datos online'.cyan)


    } catch (error) {
        console.log(error)
        throw new Error('Error en conexión a BD')
    }

}

module.exports = {
    dbConnection
}