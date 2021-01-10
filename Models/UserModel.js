//Se declaran esquemas y modelos a implementar con mongoose
const { Schema, model } = require('mongoose')

//Contenido del esquema de usuarios
//Declaracion de campos y sus tipos de datos y detalles especificos de cada campo
var UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    phone: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    birth: Date,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    tokenRecover: String
})

//Se exporta el modelo ya que es la base para crear el controlador
module.exports = model("User", UserSchema)