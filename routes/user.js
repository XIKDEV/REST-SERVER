
const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosDelete, usuariosPost } = require('../controllers');
const { esRoleValido,
    esCorreoUnique,
    existeUsuarioId } = require('../helpers');

const { validarCampos, validarJWT, validarRoles, tieneRole } = require('../middlewares')
const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    // En dado caso se permita modificar el rol
    // check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut)

router.delete('/:id', [
    validarJWT,
    // validarRoles,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosDelete)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(esCorreoUnique),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost)



module.exports = router