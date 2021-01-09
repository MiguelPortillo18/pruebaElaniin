const joi = require('joi')

const ProductValidator = {
    createProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
                .min(8),
            name: joi.string()
                .min(4)
                .required(),
            quantity: joi.string()
                .pattern(new RegExp('^[0-9]{1,5}$')),
            price: joi.string()
                .pattern(new RegExp('^\$[0-9]{1,5}|\.[0-9]{2}')),
            desc: joi.string()
                .min(5),
            productImg: joi.string()
        })

        return Schema.validateAsync(info)
    },

    updateProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
            .min(8),
            name: joi.string()
                .min(4)
                .required(),
            quantity: joi.string()
                .pattern(new RegExp('^[0-9]{1,5}$')),
            price: joi.string()
                .pattern(new RegExp('^\$[0-9]{1,5}|\.[0-9]{2}')),
            desc: joi.string()
                .min(5)
        })

        return Schema.validateAsync(info)
    },

    findProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
                .min(8)
                .valid()
                .insensitive(),
            name: joi.string()
                .min(4)
                .valid()
                .insensitive()
        })

        return Schema.validateAsync(info)
    }
}

module.exports = ProductValidator