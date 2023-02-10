const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

const { SENDGRID_APIKEY } = process.env;

sgMail.setApiKey(SENDGRID_APIKEY);

// const email = {
//     to: 'test@mail.com',
//     from: 'tkachala@icloud.com',
//     subject: '2-3 weeks maximum',
//     text: 'We are pray for peace in Ukraine',
//     html: '<strong>We are pray for peace in Ukraine</strong>',
// }

const sendEmail = async(data) => {
    try {
        const email = { ...data, from: 'tkachala@icloud.com' };
        await sgMail.send(email);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = sendEmail;