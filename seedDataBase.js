const mongoose=require('mongoose');
const Student=require('./models/studentSchema');

require('dotenv').config();
const dburl= process.env.MONGO_ATLAS;
mongoose.connect(dburl)
.then( ()=>{
    console.log('connected');

})
.catch((err)=>{
    console.log('error');
    console.log(err);
});
const SeedDB= async()=>{
    await Student.deleteMany({});
    console.log('deleted');


}

SeedDB().then(() => {
    mongoose.connection.close();
})