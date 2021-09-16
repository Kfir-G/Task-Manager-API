const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kfirg15@gmail.com',
        subject: 'Welcome To The App',
        text: `Hey! ${name}`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kfirg15@gmail.com',
        subjust: 'Cancelation Success',
        text: `Thank You ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}