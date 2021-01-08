const joi = require('joi')

const UserValidator = {
    registerValidator: info => {
        const Schema = joi.object({
            name: joi.string()
                .min(6)
                .required(),
            phone: joi.string()
                .pattern(new RegExp('^[0-9]{8}$')),
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

    loginValidator: info => {
        const Schema = joi.object({
            username: joi.string()
                .min(10),
            email: joi.string()
                .min(8)
                .email(),
            password: joi.string()
                .min(6)
                .required()
        })

        return Schema.validateAsync(info)
    }
}

module.exports = UserValidator