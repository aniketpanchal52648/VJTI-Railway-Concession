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


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const dburl= process.env.MONGO_ATLAS || 'mongodb://localhost:27017/conssesion';
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
app.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/'}),(req,res)=>{

    console.log('success');
    res.send('login success');
})
app.get('/institute_login',(req,res)=>{
    res.render('institute_login');
});



app.post('/signup', async(req,res)=>{
    console.log(req.body);
    // const student=await Student(req.body);
    // await student.save();
    // res.send(req.body);
    const { username, email, password } = req.body;
        const user = new Student({ email, username });
        const registeredStudent = await Student.register(user, password);
        req.login(registeredStudent, err => {
            if (err) return next(err);
            // req.flash('success', 'Welcom!!!');
            // res.redirect('/home');
            res.send(registeredStudent);
        })
})


app.listen(3000,()=>{
    console.log('server connected');
})