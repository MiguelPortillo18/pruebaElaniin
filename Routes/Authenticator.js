const jwt = require('jsonwebtoken')

function Authentication(req, res, next) {
    console.log(`Ejecutando middleware`);
    const token = req.header('Authorization')

    if(!token)
        return res.status(401).json({eror: true, mssage: "Access Denied"})

    try {
        const verification = jwt.verify(token, process.env.TOKEN_KEY_AUTH)
        req.user = verification

        next()
    }
    catch(err) {
        return res.status(400).json({error: true, message: "Invalid token"})
    }
}

module.exports = Authentication