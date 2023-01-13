const express=require('express');
const ejsMate=require('ejs-mate');
const app=express();
const path=require('path');
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const MongoDBS=require('connect-mongo');
const Student =require('./models/studentSchema');
const passport=require('passport');
const passportLocal=require('passport-local');
const session=require('express-session');
const flash=require('connect-flash');
const {isLoggedIn}=require('./middleware');
const Reuqest=require('./models/requestSchema');
const {sendMail}=require('./gmail/register');

require('dotenv').config(); //dotenv package

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
// dis advantage server site rentring
app.use(express.static(path.join(__dirname,'public')));
// console.log(process.env.MONGOATLAS);
const dburl= process.env.MONGO_ATLAS;

const secret=process.env.SECREAT;
mongoose.connect(dburl)
.then( ()=>{
    console.log('connected');

})
.catch((err)=>{
    console.log('error');
    console.log(err);
});
const store=new MongoDBS({
    mongoUrl:dburl,
    secret:"some",
    touchAfter:24*60*60
})
// store.on('error', function(e){
//     console.log('session store error');
// })
const sessionConfig={
    store:store,
    secret:'some',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(Student.authenticate()));
//how to store and unstore user
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());
// app.get('/',async(req,res)=>{
//     // const student = await Student.find({});
//     //     console.log(student);
//         // res.render('home');

// });
app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.get('/',(req,res)=>{
    res.render('login');
})
app.get('/delete', async(req,res)=>{
    await Reuqest.deleteMany({});
    console.log('deleted');
})
app.get('/post',async(req,res)=>{
    const reqs={
        address:"asdf asdfas fdsaf asdf",
        railway_line:"central",
        class:"second",
        starting:"ghansoli",
        destination:"matunga",
        student:"63c12e59996d902af649c8b8",
        request_status:true
    }
    // const newReq=await Reuqest.find({}).populate('student');
    const newReq=new Reuqest(reqs);
     await newReq.save();
     console.log(newReq);
     res.send(newReq);
})
app.get('/showReq',async(req,res)=>{
    const data=await Reuqest.find({});
    res.send(data);
})
app.get('/showStudent', async (req,res)=>{
    const data=await Student.find({});
    res.send(data);
})
app.get('/institute_view', async(req,res)=>{
    // const StudentData=await Student.find({});
    const Requests=await Reuqest.find({"request_status":"false"}).populate(
        "student"
    );
    // console.log(StudentData);
    res.render('institute_view',{Requests});
})


app.get('/institute_view/aprroved', async(req,res)=>{
    const Requests=await Reuqest.find({request_status:true}).populate(
        "student"
    );
    console.log(Requests);
    res.render('accepted',{Requests});
})
app.get('/institute_view/:id',(req,res)=>{
    const id=req.params.id
    res.send(id);
    // res.render('institute_view');
})
app.get('/accepted',(req,res)=>{
    res.render('accepted');
})


app.post('/application', isLoggedIn,passport.authenticate('local',{failureFlash:true,failureRedirect:'/'}),(req,res)=>{


    console.log('success');
    res.render('application');
})
app.get('/institute_login', async(req,res)=>{
    
    

    res.render('institute_login');
});



app.post('/signup', async(req,res)=>{
    console.log(req.body);
    // const student=await Student(req.body);
    // await student.save();
    // res.send(req.body);
    const { username, email, password,first_name,last_name } = req.body;
        const user = new Student({ email, username,first_name,last_name });
        const registeredStudent = await Student.register(user, password);
        req.login(registeredStudent, err => {
            if (err) return next(err);
            // req.flash('success', 'Welcom!!!');
            // res.redirect('/home');
            const mailOptions = {
                from: "vjtirailwayconcession@gmail.com",
                to: registeredStudent.email,
                subject: "Registration Successful",
                // text: "Testing mail sending using NodeJS"
                html: `<p>Dear User, you have successfully registered on our portal.</p> <p> Your USERNAME is <strong>${registeredStudent.username}</strong> and your registered email id is <strong>${registeredStudent.email}</strong>.</p> <p> You can now login, to apply for your concession at <strong>Login </strong>. </p>` 
            };
            sendMail(mailOptions);
            res.send(registeredStudent);
        })
})
app.get('/view',(req,res)=>{
    res.render('view');
})

app.listen(3000,()=>{
    console.log('server connected');
})

