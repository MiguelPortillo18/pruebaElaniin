const { Schema, model } = require('mongoose')

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

module.exports = model("Product", ProductSchema)