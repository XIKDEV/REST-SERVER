const Server = require('./models/server')
const path = require('path')


require('dotenv').config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
})


const server = new Server();

server.listen();


