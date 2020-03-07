const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('./model').User;
const encryption=require('./encryption');
const bcrypt=require('bcryptjs');

module.exports=()=>{
    passport.serializeUser((user,done)=>{
        console.log('serialize');
        //console.log(user);
        done(null, user);
    });
    passport.deserializeUser(async function(user,done){
        console.log('deserialize');
        console.log(user.id);
        const chkuser=await User.findOne({where:{id:user.id}});
        console.log('deserial user');
        //console.log(chkuser);
        done(null,chkuser);
    });

    passport.use('signin',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        session:true,
        passReqToCallback:true
    }, async function(req,email,password,done){
        const user=await User.findOne({where:{email:email}});
        //console.log(user);
        if(!user){
            console.log('no user');
            return done(null,false);
        }
        if(!bcrypt.compareSync(password, user.password)){
            console.log('not passwd');
            console.log(user.password,password);
            return done(null,false,req.flash('unPasswd','Not Correct Password!!'));
        }
        console.log('succex');
        return done(null,user);
    }));

    passport.use('signup', new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        session:false,
        passReqToCallback:true
    }, async function(req,email,password,done){
        if(req.body.password2!==password) return done(null,false,req.flash('noConfirmPasswd','Not Match Password!!'));
        const user=await User.findOne({where:{email:email}});
        if(user){
            console.log('Duplicated User');
            return done(null,false,req.flash('dupUser','Duplicated User!!'));
        }
        console.log('let\'s encrypt')
        //await encryption(req,email,password,done);
        const salt=bcrypt.genSaltSync(10);
        console.log('after gensalt');
        const hash=bcrypt.hashSync(password,salt);
        console.log('after hash. hash is ',hash);
        const newUser=await User.create({
            username:req.body.username,
            email:email,
            password:hash,
            qcount:0,
            acount:0
        });
        console.log('after creation');
        console.log('signup succex');
        return done(null,newUser,req.flash('signupsuc','signupsuccess'));
    }));
};

