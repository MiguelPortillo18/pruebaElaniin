//Se declaran esquemas y modelos a implementar con mongoose
const { Schema, model } = require('mongoose')

//Contenido del esquema de productos
//Declaracion de campos y sus tipos de datos y detalles especificos de cada campo
var ProductSchema = Schema({
    SKU: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    desc: String,
    productImg: String
})

//Se exporta el modelo ya que es la base para crear el controlador
module.exports = model("Product", ProductSchema)