//Se hacen llamadas de constantes y su require respectivo con todos los paquetes utilizados en el archivo
//Bcrypt para procesos de encriptacion, jwt para procesos de autenticacion
//Servicios de correo electronico con SendGrid
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailerHandler = require('../Utilities/Sendgrid')

//Importando el UserModel que contiene la informacion para este controlador
const User = require('../../Models/UserModel')

//Llamadas require a los 3 metodos creados en el objeto de validacion de usuarios
const { registerValidator, loginValidator, updateValidator } = require('./UserValidator')

var UserController = {
    //Funcion asincrona para el registro de usuarios
    registerUser: async function (req, res) {
        try {
            //Proceso para validar la informacion que se ingresa
            await registerValidator(req.body)

            //Validacion de campos de tipo unique para evitar el registro de usuarios con el mismo usuario o correo
            const verifyingUniqueFields = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}]})

            if(verifyingUniqueFields.length != 0)
                throw "This email or username already exists."

            //Se genera una variable que contendra la contraseña encriptada
            let passwordToHash = await bcrypt.hash(req.body.password, 10)

            //Creacion de objeto que contendra el nuevo producto
            let user = new User({
                name: req.body.name,
                phone: req.body.phone,
                username: req.body.username,
                birth: req.body.birth,
                email: req.body.email,
                password: passwordToHash
            })
            
            //Se guarda el nuevo usuario, se retorna codigo de estado exitoso y mensaje de confirmacion
            await user.save()
            return res.status(201).json({error: false, data: { _id: user._id, message: "Registered with success" } }) 
        } 
        catch (err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    //Funcion asincrona para proceso de inicio de sesion
    login: async function (req,res) {
        try {
            //Se valida la informacion que se esta ingresando
            await loginValidator(req.body)

            //Se busca el usuario de tal forma que se verifique si ya existe informacion de el
            const user = (req.body.email == null) ? await User.findOne({username: req.body.username}) : await user.findOne({email: req.body.email})
            
            //Si el usuario no se encuentra quiere decir que aun no se ha registrado
            if(!user)
                throw {error: true, message: "Username or Email not found"}

            //Variable que guarda la comparacion de la contraseña registrada por el usuario
            //y la que ingresa en el incio de sesion
            var logged = await bcrypt.compare(req.body.password, user.password)

            if(!logged)
                throw {error: true, message: "Wrong password"}

            //Se genera el token asociado al inicio de sesion del usuario
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY_AUTH)

            //Si el inicio de sesion es exitoso se retorna el codigo de estado y el token generado
            return res.status(200).json({token: token})
        
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    //Funcion asincrona para recibir informacion de un usuari oen especifico
    readCurrentUser: async function (req,res){
        //Se busca con los metodos que provee el lenguaje un usuario con base al id y posteriormente se retorna su informacion
        const user = await User.findOne({_id: req.user._id})

        return res.status(200).json(user)
    },
    //Funcion asincrona para ver el listado de usuarios registrados
    readUsers: async function(req, res) {
        try{
            //Proceso de paginacion de los resultados utilizando el query de la peticion
            const { page = 1, limit = 10 } = req.query

            const users = await User.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

                //variable que cuenta el numero de documentos (objetos creados)
            const counter = await User.countDocuments()

            //Se retornan los elementos listados y paginados
            return res.status(200).json({
                totalPages: Math.ceil(counter / limit),
                currentPage: page,
                users
            })
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            return res.status(500).json({error: true, message: "There was a problem."})
        }
    },
    //Funcion asincrona para la actualzacion de usuarios
    updateUser: async function(req, res) {
        try {
            //Se valida la informacion que se ingresa y que se desea actualizar
            await updateValidator(req.body)
            
            var actualUser = await User.findOne({_id: req.user._id})

            //Se buscan los usuarios mediante segun sus campos de tipo unique
            const findUsers = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}]})

            var verify = true

            //Se verifica que los campos unique que se desean ingresar ya se para validad o para actualizar no
            //coincidan con algunos ya existentes
            if(findUsers.length != 0)
                findUsers.forEach( usr => {
                    if(req.user._id != usr._id)
                        if(usr.username == req.body.username || usr.email == req.body.email)
                            verify = false
                })
            
            //Si se encuentran coincidencias se arroja mensaje que no se puede actualizar la informacion
            if(!verify)
                throw {error: true, message: "This Username or Email already exists"}
            
            //Se realiza de nuevo el proceso de encriptacion de la contraseña para el caso en el que el usuario la cambie
            var passwwordToHash = req.body.password == null ? null : await bcrypt.hash(req.body.password, user.password)
            
            //Si cumple con las validaciones se procede a crear el objeto que se actualizara
            actualUser = {
                name: req.body.name || actualUser.name,
                phone: req.body.phone || actualUser.phone,
                username: req.body.username || actualUser.username,
                birth: req.body.birth || actualUser.birth,
                email: req.body.email || actualUser.email,
                password: passwwordToHash || actualUser.password
            }

            //De forma asincrona el usuario se busca por su id y se actualiza con la nueva informacion
            await User.findOneAndUpdate({_id: req.user._id}, actualUser)

            //Se retornan el codigo de estado exitoso y mensaje de confirmacion
            return res.status(200).json({error: false, message: "Updated with success"})
        } 
        catch (err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    //Funcion asincrona para eliminar usuarios
    deleteUser: async function(req, res) {
        try {
            //Utilizando los metodos que provee el lenguaje se busca mediante el id el usuario que se desa eliminar
            //se retorna finalmente codigo de estado exitoso y mensaje de confirmacion
            await User.findOneAndDelete({ _id: req.user._id})

            return res.status(200).json({error: false, message: "Deleted with success"})
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    //Funcion asincrona para el proceso de envio de correo para recuperar contraseña 
    recoverPassword: async function(req, res) {
        try {
            //Se busca el usuario con los metodos que provee el lenguaje y en caso de no encontrar el email
            //se notifica que no se encuentra dicho correo
            var user = await User.findOne({email: req.body.email})

            if(!user)
                throw {error: true, message: "Email not found"} 

            //Se genera un token temporal utilizando jwt con el cual el usuario podra realziar el proceso de recuperacion
            //de su contraseña
            const newToken = jwt.sign({_id: user._id}, process.env.TOKEN_RESET_KEY, {expiresIn: '15m'})

            //Utilizando los servicios de SendGrid se crea la plantilla del correo que se enviara a cada usuario que solicite 
            //recuperar su contraseña
            const recoverEmail = {
                to: req.body.email,
                from: process.env.MAIN_EMAIL,
                subject: "ApiTest Team. Password recovery.",
                html: 
                `
                    <h2> Hola ${user.name} ! </h2>
                    <p> Para recuperar tu contraseña debes acceder al siguiente link: </p>
                    <a href="${process.env.MAIN_URL}/recover/${newToken}" target="_blank"> Link de recuperacion </a>
                    <p> En caso de tener algún problema, favor escribir a este correo: ${process.env.MAIN_EMAIL} para obtener soporte técnico. </p>
                    <h3> ApiTest Team. </h3>
                `
            }

            //Si todo el proceso sale como se debe, el usuario recibe un nuevo token de recuperacion y se procede a enviar el correo
            //de recuperacion al email que el usuario registró
            await User.findOneAndUpdate({_id: user._id}, {tokenRecover: newToken})
            await mailerHandler(recoverEmail) 

            //Se retorna el codigo de estado exitoso y mensaje de confirmacion
            return res.header('Authorization', newToken).status(200).json({error: false, message: "Email sent."})
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(500).json(err)
        }
    },
    //Funcion asincrona para la creacion de productos
    recoveryHandler: async function(req, res) {
        try {
            //Se manda a llamar al header de la request porque sera necesario la autorizacion 
            //del mismo para cambiar la contraseña
            const newToken = req.header('Authorization')

            if(!newToken)
                throw {error: true, message: "Access Denied"}

            //Se verifica qur el token de recuperacion se valido para que el usuario pueda hacer el proceso
            //en caso de no ser valido se notifica
            const verifyingToken = jwt.verify(newToken, process.env.TOKEN_AUTH_RESET_KEY)

            if(!verifyingToken)
            throw {error: true, message: "Invalid token"}

            //Se busca el usuario mediante el token de verificacion y se procede a realizar el proceso de ingreso de la nueva contraseña
            var user = await User.findOne({_id: verifyingToken._id}) 

            //Se encripta la nueva contraseña
            user.password = await bcrypt.hash(req.body.newPassword, parseInt(process.env.SALT))

            user.tokenRecover = null

            //Se actualiza la informacion del usuario con las nuevas credenciales y se retorna el codigo de exito
            await User.findOneAndUpdate({_Id: user._id}, {password: user.password, tokenRecover: user.tokenRecover})

            return res.status(200).json({error: false, message: "Password recover correctly, try to log in"})
        }
        catch(err) {
            //En caso de no funcionar el proceso de creacion se retornan codigo de estado erroneo y mensajes detallando el error
            console.log(err);
            return res.status(500).json(err)
        }
    }
}

//Se exporta el controller
module.exports = UserController