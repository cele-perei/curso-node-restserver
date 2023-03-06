const { response } = require("express");
const {Categoria} = require("../models");


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    
    const query = {estado: true}
    const {limite = 5, desde = 0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ]);
    res.json({
        total,
        categorias
    });
}

// obtenerCategorias - populate {}

const obtenerCategoria = async (req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    res.json(categoria);

}

// crearCategoria

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //guardar db
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}


// borrarCategoria - estado :false

const borrarCategoria = async (req = request, res = response) => {
    const {id} = req.params;
    //físicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    //obtener usuario autenticado
    res.json({ categoria });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria

}