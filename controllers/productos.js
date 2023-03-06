const { response } = require("express");
const {Producto, Categoria} = require("../models");


// obtenerCategorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
    
    const query = {estado: true}
    const {limite = 5, desde = 0} = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ]);
    res.json({
        total,
        productos
    });
}

// obtenerCategorias - populate {}

const obtenerProducto = async (req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id).
    populate('usuario','nombre').
    populate('categoria','nombre');
    res.json(producto);

}

// crearCategoria

const crearProducto = async (req, res = response) => {
    //const nombre = req.body.nombre.toUpperCase();
    //const {precio, categoria, descripcion, disponible} = req.body;
    const {estado, usuario, ...body} = req.body;
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    //encontrar el objeto de la categoria
    /*const categoriaDB = await Categoria.findOne({categoria});
    if (!categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} no existe`
        });
    } **/
    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    //guardar db
    await producto.save();

    res.status(201).json(producto);
}

// actualizarCategoria
const actualizarProducto = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}


// borrarCategoria - estado :false

const borrarProducto = async (req = request, res = response) => {
    const {id} = req.params;
    //físicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    //obtener usuario autenticado
    res.json({ producto });
} 

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto

}