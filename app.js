require('dotenv').config(); 
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
const Request=require('./models/requestSchema');
const {sendMail}=require('./gmail/register');
const multer=require('multer');
const {storage}=require('./cloudinary/index');
const upload=multer({storage});
const {approveMail}=require('./gmail/approved');



//dotenv package

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
app.use((req,res,next)=>{
    // console.log(req.session);
    // res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.get('/',(req,res)=>{
    res.render('login');
})
app.get('/delete', async(req,res)=>{
    await Request.deleteMany({});
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
        request_status:false
    }
    // const newReq=await Reuqest.find({}).populate('student');
    const newReq=new Request(reqs);
     await newReq.save();
     console.log(newReq);
     res.send(newReq);
})
app.get('/showReq',async(req,res)=>{
    const data=await Request.find({});
    res.send(data);
})
app.get('/showStudent', async (req,res)=>{
    const data=await Request.find({});
    res.send(data);
})
app.get('/institute_view', async(req,res)=>{
    // const StudentData=await Student.find({});
    const Requests=await Request.find({"request_status":"false"}).populate(
        "student"
    );
    // console.log(StudentData);
    res.render('institute_view',{Requests});
})


app.get('/institute_view/aprroved', async(req,res)=>{
    const Requests=await Request.find({request_status:true}).populate(
        "student"
    );
    console.log(Requests);
    res.render('accepted',{Requests});
})

app.get('/institute_view/:id',async(req,res)=>{
    const id=req.params.id;
    const reqs=await Request.findById(id).populate('student');
    console.log(reqs);


    res.render('view',{reqs});
    // res.render('institute_view');
})
app.post('/deleteAP/:id',async(req,res)=>{
    const id=req.params.id;
    await Request.findByIdAndDelete(id);
    res.redirect('/institute_view');
})
app.get('/institute_view/approved/:id', async(req,res)=>{
    const id=req.params.id;
    const reqs=await Request.findById(id).populate('student');
    // console.log(reqs);
    res.render('viewA',{reqs});
})
// app.get('/accepted',(req,res)=>{
//     res.render('accepted');
// })

// app.get('/institue_view/accepted/:id', async(req,res)=>{
//     const request=await Request.findById(req.params.id);
//     request.request_status=true;
//     await request.save();;
//     res.redirect('/institue_view');

// })
app.get('/institute_view/reverted/:id',async(req,res)=>{
    const req_id=req.params.id
    console.log(req_id);
    const request=await Request.findById(req_id).populate('student');
    console.log(request);
    res.render('rejected',{request});

})
app.post('/institue_view/reverted/:id',async(req,res)=>{
    const req_id=req.params.id
    const request=await Request.findById(req_id).populate('student');
    const id=request.student._id;
    // await Reuqest.findByIdAndDelete(req_id);
    const student=await Student.findById(id);
    const mailOptions = {
        from: "vjtirailwayconcession@gmail.com",
        to: student.email,
        subject: "Request Reverted",
        // text: "Testing mail sending using NodeJS"
        html: `<p>Dear ${student.first_name} ${student.last_name}, your application for the concession has been reverted back due to the provided <strong> ${req.body.reason} ${req.body.reason1} </strong>.</p> <p> You may now check the status of the application and make the required changes and re-apply for the application. </p>` 
    };

    sendMail(mailOptions);
    res.redirect('/institute_view');



})
app.post('/institute_view/accepted/:id',async(req,res)=>{
    const req_id=req.params.id
    const request=await Request.findById(req_id).populate('student');
    request.request_status=true;
    await request.save();
    const id=request.student._id;
    // await Reuqest.findByIdAndDelete(req_id);
    const student=await Student.findById(id);
    const mailOptions = {
    from: "vjtirailwayconcession@gmail.com",
    to: student.email,
    subject: "Request Approved",
    // text: "Testing mail sending using NodeJS"
    html: `<p> Dear ${student.first_name} ${student.last_name}, your request for the railway concession has been approved.</p>  <p>You may now visit the Railway Concession Office and get your approved concession, duly stamped and signed. </p>`
};
approveMail(mailOptions);
res.redirect('/institute_view');


})
// app.get('/application',)
app.post('/application',passport.authenticate('local',{failureFlash:true,failureRedirect:'/'}), async(req,res)=>{


    // console.log(req.body);
    // const user=req.body.username;
    const s=await Student.findOne({username:req.session.passport.user});
    // console.log(s._id)


    // req.flash('success',"welcome!!!");
    res.render('application',{id:s._id});
});
// app.get('/con',(req,res)=>{
//     res.render('concession-details');
// })
// app.post('/con',async(req,res)=>{
//     res.send(req.body);
// })
app.post('/application/basicdetails', isLoggedIn,async(req,res)=>{
    // console.log(req.body);
    // const u=req.session.path.user
    const user= await Student.findOne({username:req.session.passport.user});
    // console.log(user[0]);
    const id=user._id;
    // console.log((id));
    // await Student.update({_id:req.body.reg_name},{$set:{...req.body}});
    // const st=Student.find({_id:req.body.reg_name});
    // console.log(st);
    // // console.log(user);
    const st=await Student.findByIdAndUpdate({_id:id},{...req.body},{
        returnOriginal:false
    })
    const caste=st.caste;

    // res.send('done');
    res.redirect(`/application/uploaddoc/${id}`);
    



})
app.get('/application/uploaddoc/:id', async(req,res)=>{
    
    const st=await Student.findById(req.params.id);
    // const caste=st.caste
    res.render('documents',{st});
})
app.post('/application/uploaddoc/:id',upload.array('image',3),async(req,res)=>{
    // const student=await Student.findById(req.params._id);
    // console.log(req.files[0]);
    // res.send('done');
    // res.render('concession-details',{student});
    // student.adhar_card.url=req.files[0].path;
    // student.adhar_card.filename=req.files[0].filename;
    // student.collge_Detail.url=req.files[1].path;
    // student.college_Detail.filename=req.files[1].filename;

    // if(req.files[2].path){
    //     student.caste_validity.url=req.files[2].path;
    // student.caste_validity.filename=req.files[2].filename;
    // }
    images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const student=await Student.findByIdAndUpdate({_id:req.params.id},{images});
    // await student.save();
    // res.send('done');
    // console.log(student.images);
    res.redirect(`/application/conssesion/${req.params.id}`);
    // student.
        

})
app.get('/application/conssesion/:id',async(req,res)=>{

    const student=await Student.findById(req.params.id);
    // console.log(req.files);
    // res.send('done');
    res.render('concession-details',{student});
})
app.post('/application/conssesion/:id',async(req,res)=>{
    // const student=await Student.findByIdAndUpdate({_id:req.params._id},{...req.body});
    const request=await Request({...req.body});
    request.student=req.params.id;
    await request.save();
    console.log(request);
    // res.send('done');
    // res.redirect('/application');
    // res.render('status',{});
    res.redirect(`/status/${request._id}`);


})
app.get('/status/:id',async(req,res)=>{
    const re=await Request.findById(req.params.id);
    res.render('status',{re});
})
app.get('/logout',isLoggedIn ,async (req,res)=>{
    req.logout(function (err) {
        if (err) {
            // req.flash('error', 'something went wrong');
            return res.redirect('/');

        }


        // req.flash('success', 'Goodbye!!');
        res.redirect('/');
    });
    
})
// app.post('/application/basic', async (req,res)=>{

// })



// app.get('/documents',(req,res)=>{
//     res.render('documents', {caste: "SC"});

// })



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
app.post('/institute_login',(req,res)=>{
    const {email,password}=req.body;
    if(email==='kaka@gmail.com' && password==='123'){
            res.redirect('/institute_view');
    }else{
        res.redirect('/institute_login');
    }
})

// app.get('/rejected',(req,res)=>{
//     res.render('rejected');
// })
app.get('/status',(req,res)=>{
    res.render('status');
})
app.listen(3000,()=>{
    console.log('server connected');
})


