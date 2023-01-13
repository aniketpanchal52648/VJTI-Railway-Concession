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
    },
    middle_name:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    DOB:{
        type:String,
        require:true
    },
    caste:{
        type:String,
        require:true
    },
    reg_no:{
        type:Number,
        require:true
    },
    year:{
        type:String,
        require:true
    },
    semester:{
        type:String,
        require:true
    },
    programme:{
        type:String,
        require:true
    },
    dept:{
        type:String,
        require:true
    },
    adhar_card:{
        type:String,
        require:true
    },
    collge_Detail:{
        type:String,
        require:true
    },
    caste_validity:{
        type:String,
        require:true
    }




});
studentSchema.plugin(passportLocalM);
// module.exports=mongoose.model('User',userScheama);
module.exports=mongoose.model('Student',studentSchema);

