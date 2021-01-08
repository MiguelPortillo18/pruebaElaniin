const bcrypt = require('bcrypt')

const User = require('../../Models/UserModel')

const { registerValidator } = require('./Validator')

var UserController = {
    registerUser: async (req, res) => {
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
            })
            
            await user.save()
            return res.status(201).json({error: false, data: { _id: user._id, message: "Registered with success" } }) 
        } 
        catch (err) {
            console.log(err);
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },
    readUser: async function(req, res) {
        var userList = await User.find()

        return res.status(200).json(
            {
            count: userList.length,
            list: userList
            }
        )
    },
    updateUser: async function(req, res) {
        try {
            var updateUser = await User.findOne({_id: req.body._id})

            if(!updateUser)
                throw { err: "User not found" }

            updateUser = {
                name: req.body.name || updateUser.name,
                phone: req.body.phone || updateUser.phone,
                username: req.body.username || updateUser.username,
                birth: req.body.birth || updateUser.birth,
                email: req.body.email || updateUser.email,
                password: req.body.password || updateUser.password
            }

            await User.findOneAndUpdate({ _id: req.body._id}, updateUser)

            return res.status(200).json({error: false, data: { _id: updateUser._id, message: "Updated with success" } })
        } 
        catch (err) {
            console.log(err);
            return res.status(400).json({error: true, message: "Something went wrong", err: err})
        }
    },
    deleteUser: async function(req, res) {
        await User.findOneAndDelete({ _id: req.body._id})

        return res.status(200).json({error: false, message: "Deleted with success"})
    }
}

module.exports = UserController