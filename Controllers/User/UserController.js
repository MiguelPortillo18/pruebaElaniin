const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailerHandler = require('../Utilities/Sendgrid')

const User = require('../../Models/UserModel')

const { registerValidator, loginValidator, updateValidator } = require('./UserValidator')

var UserController = {
    registerUser: async function (req, res) {
        try {

            await registerValidator(req.body)

            const verifyingUniqueFields = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}]})

            if(verifyingUniqueFields.length != 0)
                throw "This email or username already exists."

            let passwordToHash = await bcrypt.hash(req.body.password, 10)

            let user = new User({
                name: req.body.name,
                phone: req.body.phone,
                username: req.body.username,
                birth: req.body.birth,
                email: req.body.email,
                password: passwordToHash
                //productImg: req.file.location
            })
            
            await user.save()
            return res.status(201).json({error: false, data: { _id: user._id, message: "Registered with success" } }) 
        } 
        catch (err) {
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    login: async function (req,res) {
        try {
            await loginValidator(req.body)

            const user = (req.body.email == null) ? await User.findOne({username: req.body.username}) : await user.findOne({email: req.body.email})
            
            if(!user)
                throw {error: true, message: "Username or Email not found"}

            var logged = await bcrypt.compare(req.body.password, user.password)

            if(!logged)
                throw {error: true, message: "Wrong password"}

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY_AUTH)

            return res.status(200).json({token: token})
        
        }
        catch(err) {
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    readCurrentUser: async function (req,res){
        const user = await User.findOne({_id: req.user._id})

        return res.status(200).json(user)
    },
    readUsers: async function(req, res) {
        try{
            const { page = 1, limit = 10 } = req.query

            const users = await User.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const counter = await User.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(counter / limit),
                currentPage: page,
                users
            })
        }
        catch(err) {
            return res.status(500).json({error: true, message: "There was a problem."})
        }
    },
    updateUser: async function(req, res) {
        try {
            await updateValidator(req.body)
            
            var actualUser = await User.findOne({_id: req.user._id})

            const findUsers = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}]})

            var verify = true

            if(findUsers.length != 0)
                findUsers.forEach( usr => {
                    if(req.user._id != usr._id)
                        if(usr.username == req.body.username || usr.email == req.body.email)
                            verify = false
                })

            if(!verify)
                throw {error: true, message: "This Username or Email already exists"}

            var passwwordToHash = req.body.password == null ? null : await bcrypt.hash(req.body.password, user.password)

            actualUser = {
                name: req.body.name || actualUser.name,
                phone: req.body.phone || actualUser.phone,
                username: req.body.username || actualUser.username,
                birth: req.body.birth || actualUser.birth,
                email: req.body.email || actualUser.email,
                password: passwwordToHash || actualUser.password
            }

            await User.findOneAndUpdate({_id: req.user._id}, actualUser)

            return res.status(200).json({error: false, message: "Updated with success"})
        } 
        catch (err) {
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    deleteUser: async function(req, res) {
        await User.findOneAndDelete({ _id: req.body._id})

        return res.status(200).json({error: false, message: "Deleted with success"})
    },
    recoverPassword: async function(req, res) {
        try {
            var user = await User.findOne({email: req.body.email})

            if(!user)
                throw {error: true, message: "Email not found"} 

            const newToken = jwt.sign({_id: user._id}, process.env.TOKEN_RESET_KEY, {expiresIn: '15m'})

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

            await User.findOneAndUpdate({_id: user._id}, {tokenRecover: newToken})
            await mailerHandler(recoverEmail) 

            return res.header('Authorization', newToken).status(200).json({error: false, message: "Email sent."})
        }
        catch(err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },
    recoveryHandler: async function(req, res) {
        try {
            const newToken = req.header('Authorization')

            if(!newToken)
                throw {error: true, message: "Access Denied"}

            const verifyingToken = jwt.verify(newToken, process.env.TOKEN_AUTH_RESET_KEY)

            if(!verifyingToken)
            throw {error: true, message: "Invalid token"}

            var user = await User.findOne({_id: verifyingToken._id}) 

            user.password = await bcrypt.hash(req.body.newPassword, parseInt(process.env.SALT))

            user.tokenRecover = null

            await User.findOneAndUpdate({_Id: user._id}, {password: user.password, tokenRecover: user.tokenRecover})

            return res.status(200).json({error: false, message: "Password recover correctly, try to log in"})
        }
        catch(err) {
            console.log(err);
            return res.status(500).json(err)
        }
    }
}

module.exports = UserController