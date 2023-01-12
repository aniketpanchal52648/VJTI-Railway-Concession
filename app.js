const express=require('express');
const ejsMate=require('ejs-mate');
const app=express();
const path=require('path');
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const Student =require('./models/studentSchema');

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const dburl= process.env.MONGO_ATLAS || 'mongodb://localhost:27017/conssesion';
mongoose.connect(dburl)
.then( ()=>{
    console.log('connected');

})
.catch((err)=>{
    console.log('error');
    console.log(err);
});
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
app.get('/institute_login',(req,res)=>{
    res.render('institute_login');
})
app.post('/',(req,res)=>{

    console.log(req.body);
    res.send(req.body);
})

app.post('/signup', async(req,res)=>{
    console.log(req.body);
    const student=await Student(req.body);
    await student.save();
    res.send(req.body);
})


app.listen(3000,()=>{
    console.log('server connected');
})