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
                .pattern(new RegExp('^[0-9]{2}$')),
            price: joi.string()
                .pattern(new RegExp('^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$')),
            desc: joi.string()
                .min(5)
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
                .pattern(new RegExp('^[0-9]{4}$')),
            price: joi.string()
                .pattern(new RegExp('^\$(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?$')),
            desc: joi.string()
                .min(5)
        })

        return Schema.validateAsync(info)
    },

    findProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
            .min(8),
            name: joi.string()
                .min(4)
        })

        return Schema.validateAsync(info)
    }
}

module.exports = ProductValidator