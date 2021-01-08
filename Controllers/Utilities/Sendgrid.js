const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_KEY)

async function sendEmail(email) {
    try {
        await sendgrid.send(email)
    }
    catch(err) {
        return err
    }
}

module.exports = sendEmail