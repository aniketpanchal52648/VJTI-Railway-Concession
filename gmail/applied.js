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
    subject: "Application Submitted",
    // text: "Testing mail sending using NodeJS"
    html: "<p> Dear Applicant, You have successfully applied for the Railway Concession, Your application ID is <strong>ID</strong> </p> <p> You can always view you status of the application at Website. </p>" 
};

transporter.sendMail(mailOptions, function(error, info){

    if(error){
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});