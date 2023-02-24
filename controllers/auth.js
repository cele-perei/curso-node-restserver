const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - correo'
            });
        }

        //si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - estado:false'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos - password'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json ({
            usuario,
            token
        });
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })

    }

}

const googleSignIn = async (req, res = response ) => {
    const {id_token} = req.body;
    //console.log(id_token);

    try {

        const {nombre, img, correo} = await googleVerify(id_token);
        //console.log({nombre});
        let usuario = await Usuario.findOne({correo});
        //console.log({usuario});
        if (!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo, 
                password: ':P',
                rol: "USER_ROLE",
                estado: true,
                img,
                google : true

            };
            usuario = new Usuario (data);
            await usuario.save();
        }

        //si el usuario en db
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    
}

module.exports = {
    login, googleSignIn
}