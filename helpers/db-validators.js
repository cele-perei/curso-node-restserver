const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

const esRolValido = async ( rol = '' ) => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    } 
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El email ${ correo } ya existe`);
    }
}

// const existeUsuarioPorId = async (id) => {
//     const existeUsuario = await Usuario.findById(id);
//     if (!existeUsuario){
//         throw new Error(`El usuario con id ${ id } no existe`);
//     }
// }

const existeUsuarioPorId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await Usuario.findById( id ).exec();
        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
};

const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`El id ${ id } no existe`);
    }
};
const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error(`El id ${ id } no existe`);
    }
};

//validarColeccionesPermitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error (`La coleccion ${coleccion} no es permitida. Las permitidas son: ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido, emailExiste, existeUsuarioPorId, existeCategoriaPorId, existeProductoPorId, coleccionesPermitidas
}