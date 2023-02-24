const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    const query = {estado: true}
    const {limite = 5, desde = 0} = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;
    console.log(resto);

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);

    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json(usuario);
}

const usuariosPost = async (req = request, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Verificar si el correo existe
    

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario 
    });
}

const usuariosDelete = async (req = request, res = response) => {
    const {id} = req.params;
    //físicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});
    //obtener usuario autenticado
    res.json({ usuario });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}