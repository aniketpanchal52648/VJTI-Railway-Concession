const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalM=require('passport-local-mongoose');
const studentSchema= new Schema({
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        require:true
    }



});
studentSchema.plugin(passportLocalM);
// module.exports=mongoose.model('User',userScheama);
module.exports=mongoose.model('Student',studentSchema);

