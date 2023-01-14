const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vjtirailwayconcession@gmail.com",
        pass: "lvhoqvpbulpwliha"
    }
});

// const mailOptions = {
//     from: "vjtirailwayconcession@gmail.com",
//     to: "brupadhyay_b20@ee.vjti.ac.in",
//     subject: "Request Approved",
//     // text: "Testing mail sending using NodeJS"
//     html: "<p> Dear User, your request for the railway concession has been approved.</p>  <p>You may now visit the Railway Concession Office and get your approved concession, duly stamped and signed. </p>" 
// };
module.exports.approveMail=(mailOptions)=>{
transporter.sendMail(mailOptions, function(error, info){

    if(error){
        console.log(error);
    } else {
        console.log("Email sent: " + info.response);
    }
});
}