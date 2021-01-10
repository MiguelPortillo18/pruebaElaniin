//LLamada require a la variable joi para utilizar el paquete joi
const joi = require('joi')

//Creación del objeto validator para validaciones de usuarios
const UserValidator = {
    //Validaciones para aplicar en el proceso de registro de usuarios
    registerValidator: info => {
        const Schema = joi.object({
            name: joi.string()
                .min(6)
                .required(),
            phone: joi.string()
                .pattern(new RegExp('^[0-9]{8,15}$')), //Expresion regular para verificar que el telefono tenga el formato correcto
            username: joi.string()
                .min(6)
                .required(),
            birth: joi.string(),
            email: joi.string()
                .min(8)
                .required()
                .email(),
            password: joi.string()
                .min(6)
                .required()
        })

        return Schema.validateAsync(info)
    },
    //Validaciones para aplicar en el proceso de inicio de sesion
    loginValidator: info => {
        const Schema = joi.object({
            username: joi.string()
                .min(6),
            email: joi.string()
                .min(8)
                .email(),
            password: joi.string()
                .min(6)
                .required()
        })

        return Schema.validateAsync(info)
    },
    //Validaciones para aplicar en el proceso de actualización de un usuario
    updateValidator: info => {
        const Schema = joi.object({
            name: joi.string()
                .min(6),
            phone: joi.string()
                .pattern(new RegExp('^[0-9]{8,15}$')),
            username: joi.string()
                .min(6),
            birth: joi.string(),
            email: joi.string()
                .min(8)
                .email(),
            password: joi.string()
                .min(6)
        })

        return Schema.validateAsync(info)
    }
}

//Exportando el objeto creado
module.exports = UserValidator