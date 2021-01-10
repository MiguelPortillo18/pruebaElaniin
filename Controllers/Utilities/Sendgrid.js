//Llamada de require para utilizar los servicios del paquete de sendgrid
const sendgrid = require('@sendgrid/mail')

//Configuracion de los servicios del sender creado en sendgrid
sendgrid.setApiKey(process.env.SENDGRID_KEY)

//Funcion que se encarga unicamente de hacer el proceso correcto del envio de emails
async function sendEmail(email) {
    try {
        await sendgrid.send(email)
    }
    catch(err) {
        return err
    }
}

//Se exporta funcion porque se utilizara en los demas archivos
module.exports = sendEmail