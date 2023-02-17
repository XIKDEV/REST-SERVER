const auth = require('./auth');
const buscar = require('./buscar');
const categorias = require('./categorias');
const productos = require('./productos');
const uploads = require('./uploads');
const user = require('./user');

module.exports = {
  ...auth,
  ...buscar,
  ...categorias,
  ...productos,
  ...uploads,
  ...user,
};
