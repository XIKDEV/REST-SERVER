const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria,
    obtenerCategorias,
    obtenerCategoriasId,
    eliminarCategoria,
    actualizarCategoria } = require('../controllers');
const { existeCategoriaId } = require('../helpers/db-validate');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/categorias
 */
// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)
// Obtener una categoria por id - publico
router.get('/:id',
    [
        check('id', 'No es un ID de mongo').isMongoId(),
        // check('id').custom(existeCategoriaId),
        validarCampos
        // 
    ]
    , obtenerCategoriasId);

// Crear categorias - privado
router.post('/', [validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos],
    crearCategoria)

// Actualizar por id - privado - cualquier rol
router.put('/:id', [
    validarJWT,
    check('id', 'Id no valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    check('nombre', 'Ingrese un nombre para la categoria').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - privado - admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'Id no valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], eliminarCategoria);

module.exports = router;