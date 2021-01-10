//LLamada require a la variable joi para utilizar el paquete joi
const joi = require('joi')

//Creación del objeto validator para validaciones de productos
const ProductValidator = {
    //Validaciones para aplicar en el proceso de creación de productos
    createProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
                .min(8),
            name: joi.string()
                .min(4)
                .required(),
            quantity: joi.string()
                .pattern(new RegExp('^[0-9]{1,5}$')), //Expresion regular para que la cantidad de productos sean unicamente
                                                      //numeros enteros
            price: joi.string()
                .pattern(new RegExp('^\$[0-9]{1,5}|\.[0-9]{2}')), //Expresion regular para que el precio del producto sea en formato de moneda
            desc: joi.string()
                .min(5),
            productImg: joi.string().uri()
        })

        return Schema.validateAsync(info)
    },
    //Validaciones para aplicar en el proceso de actualización de un producto
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
    //Validaciones para aplicar en el proceso de busqueda de un producto
    findProductValidator: info => {
        const Schema = joi.object({
            SKU: joi.string()
                .min(8)
                .valid()
                .insensitive(), //Metodo del paquete joi que verifica el case insensitivity de las entradas
            name: joi.string()
                .min(4)
                .valid()
                .insensitive()
        })

        return Schema.validateAsync(info)
    }
}

//Exportando el objeto creado
module.exports = ProductValidator