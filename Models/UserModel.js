const { Schema, model } = require('mongoose')

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

module.exports = model("User", UserSchema)