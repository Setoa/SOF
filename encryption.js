const User=require('./model').User;
const bcrypt=require('bcryptjs');
let user;
module.exports=(req,email,password,done,callback)=>{
    bcrypt.genSalt(10, function(err, salt){
        if(err){
            console.log('gensalterr')
            return done(err);
        }
        console.log('gensalt') 
        bcrypt.hash(password, salt, async function(err, hash){
            if(err){ 
                console.log('hash err');
                return done(err);
            }
            console.log('hash is : ',hash);
            user={
                username:req.body.username,
                email:email,
                password:hash,
                qcount:0,
                acount:0
            }
            await User.create(user);
            console.log('after creation');
        });
    });
};