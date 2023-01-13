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
    subject: "Registration Successful",
    // text: "Testing mail sending using NodeJS"
    html: "<p>Dear User, you have successfully registered on our portal.</p> <p> Your USERNAME is <strong>username</strong> and your registered email id is <strong>email</strong>.</p> <p> You can now login, to apply for your concession at <strong>Login </strong>. </p>" 
};

transporter.sendMail(mailOptions, function(error, info){

    if(error){
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});