
const {Router} = require('express');
const {check, sanitizeBody } = require('express-validator');
const { body } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();



router.get('/',usuariosGet);

router.put('/:id', [
   check('id').custom( existeUsuarioPorId ), // Aquí se realizan las dos validaciones
   validarCampos
], usuariosPut);

 router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe contener más de 6 caracteres').isLength({ min:6 }),
    body('correo', 'El correo no es válido').isEmail(),
    body('correo').custom( emailExiste ),
    //body('rol', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    body('rol').custom( esRolValido ),
    validarCampos
 ] ,usuariosPost);

router.delete('/:id', [
   check('id').custom( existeUsuarioPorId ), // Aquí se realizan las dos validaciones
   validarCampos
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;