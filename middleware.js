const Student=require('./models/studentSchema');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must me login');
        return res.redirect('/');
    }
    next();

}

