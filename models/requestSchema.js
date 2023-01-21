const mongoose=require('mongoose');
const { boolean } = require('webidl-conversions');
const Schema=mongoose.Schema;
const requestSchema= new Schema({
    request_status:{
        type:Boolean,
        default:false
        

    },
    address:{
        type:String,
        require:true
    },
    railway_line:{
        type:String,
        require:true

    },
    starting:{
        type:String,
        require:true
    },
    destination:{
        type:String,
        require:true
    },
    class:{
        type:String,
        require:true
    },
    duration:{
        type:String,
        require:true
    },
    student:{
        type:Schema.Types.ObjectId,
        ref:'Student'
    },
    date:{
        type:String,
        require:true
    }

});
module.exports=mongoose.model('Request',requestSchema);