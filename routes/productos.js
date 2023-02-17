const { Router } = require('express');
const { check } = require('express-validator');
const { registrarProducto, obtenerProducto, obtenerProductoId, actualizarProducto, eliminarProducto } = require('../controllers');
const { existeProductoId, esRoleValido } = require('../helpers');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = new Router();

router.get('/', obtenerProducto)

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProductoId)

router.post('/', [
    validarJWT,
    check('nombre', 'El campo es obligatorio').not().isEmpty(),
    check('categoria', 'Es obligatorio seleccionar una categoria').not().isEmpty(),
    check('categoria', 'Id no valido').isMongoId(),
    validarCampos
], registrarProducto)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoId),
    check('nombre', 'El campo es obligatorio').not().isEmpty(),
    check('categoria', 'Es obligatorio seleccionar una categoria').not().isEmpty(),
    check('categoria', 'Id no valido').isMongoId(),
    validarCampos
], actualizarProducto)

router.delete('/:id', [validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], eliminarProducto)




module.exports = router