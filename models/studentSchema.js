const mongoose =require('mongoose');
const Schema=mongoose.Schema
const studentSchema= new Schema({
    username:String,
    password:String,
    first_name:String,
    last_name:String,
    email:String



});
module.exports=mongoose.model('Student',studentSchema);

