const {Router} = require('express');
const {check } = require('express-validator');
const { crearProducto , obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const router = Router();

//  {{url}}/api/categorias

//obtener todas las categorias - publico
router.get('/', obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] , obtenerProducto);

//crear categoria con cualquier rol, osea cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
    ], crearProducto);

//actualizar - privado- cualquiera con token valido
router.put('/:id', [
    validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
  //  check('id','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

//borrar - privado- solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] ,borrarProducto);

module.exports = router;
