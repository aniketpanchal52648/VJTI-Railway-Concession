const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vjtirailwayconcession@gmail.com",
        pass: "lvhoqvpbulpwliha"
    }
});

const mailOptions = {
    from: "vjtirailwayconcession@gmail.com",
    to: "brupadhyay_b20@ee.vjti.ac.in",
    subject: "Request Reverted",
    // text: "Testing mail sending using NodeJS"
    html: "<p>Dear User, your application for the concession has been reverted back due to the provided <strong> reason </strong>.</p> <p> You may now check the status of the application and make the required changes and re-apply for the application. </p>" 
};

transporter.sendMail(mailOptions, function(error, info){

    if(error){
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});