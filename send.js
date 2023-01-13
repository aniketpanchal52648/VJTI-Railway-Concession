const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bh8692080@gmail.com",
        pass: "jyvvhunbrcmremik"
    }
});

const mailOptions = {
    from: "bh8692080@gmail.com",
    to: "esarvesh11@gmail.com",
    subject: "gmail service test - rail ghate mein",
    // text: "Testing mail sending using NodeJS"
    html: "sending <button>Click Me</button> using nodeJs"
};

transporter.sendMail(mailOptions, function(error, info){

    if(error){
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});