
module.exports=(req,res)=>{
    if(!req.user){
        console.log('not loggined');
        res.redirect('/');
    }
}