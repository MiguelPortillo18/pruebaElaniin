//Llamada de require para utilizar los servicios del paquete jwt
const jwt = require('jsonwebtoken')

//Funcion encargada de utilizar los servicios de jwt para procesos de autenticacion
function Authentication(req, res, next) {
    
    //Se localiza el header de la peticion y se coloca la palabra con la que se haran los procesos de autenticacion
    const token = req.header('Authorization')

    //Si el token no se coloca en el header de la peticion o la palabra clave se arroja mensaje de error
    if(!token)
        return res.status(401).json({eror: true, mssage: "Access Denied"})

    try {
        //Proceso de verificacion tanto de los usuarios como de los productos que nse vayan creando y que se autentiquen
        const verification = jwt.verify(token, process.env.TOKEN_KEY_AUTH)
        req.user = verification
        req.product = verification
        
        //Ejecucion del middleware
        next()
    }
    catch(err) {
        //Retorno de codigo de error y mensaje de error en caso de que se ingrese el token de autenticacion incorrecto
        return res.status(400).json({error: true, message: "Invalid token"})
    }
}

//Se exporta la funcion ya que se utiliza en el index.js en las peticiones que lo necesiten
module.exports = Authentication