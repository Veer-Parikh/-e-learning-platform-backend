require('dotenv').config()
const {Resend} = require('resend')

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
            console.error('Error sending registration email:', error);
            throw new Error('Failed to send registration email.');
        }

        console.log('Registration email sent successfully:', data);
    } catch (error) {
        throw new Error('Failed to send registration email.');
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
            console.error('Error sending login email:', error);
            throw new Error('Failed to send login email.');
        }

        console.log('login email sent successfully:', data);
    } catch (error) {
        throw new Error('Failed to send login email.');
    }
};

module.exports = {sendReg,sendLogin}