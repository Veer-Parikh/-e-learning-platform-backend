require('dotenv').config()
const {Resend} = require('resend');
const logger = require('./logger');

const resend = new Resend(process.env.RESEND_URL);
const sendReg = async (mail) => {
    try{
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: "parikhveer71@gmail.com",
            subject: "welcome to our platform",
            html: "<strong>registration successful!</strong>",
        });
        if (error) {
            logger.error('Error sending registration email:', error);
        }

        logger.info('Registration email sent successfully:', data);
    } catch (error) {
        throw logger.error('Failed to send registration email.');
    }
};

const sendLogin = async (mail) => {
    try{
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: "parikhveer71@gmail.com",
            subject: "welcome to our platform",
            html: "<strong>login successful!</strong>",
        });
        if (error) {
            logger.error('Error sending login email:', error);
        }

        logger.info('login email sent successfully:', data);
    } catch (error) {
        logger.error('Failed to send login email.');
    }
};

module.exports = {sendReg,sendLogin}