const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});
module.exports = async function (email, url) {
    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Please, verify your email",
        text: `To verify your email, please click on this link - ${url}`,
        html: `<p>To verify your email, please click on this <a href=${url}>link</a></p>`,
    };
    await transporter.sendMail(message);
};
