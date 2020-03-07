//그리고 index.pug 에서 post한 아이디 비번 가져오고 login.js 부에서 아이디 비번 참거짓 판단 해온다. 참일시 users.pug로 이동.(나중에 home.pug 로 대체)
//아닐 시 index.pug 안에서 에러 도출. 

const express = require('express');
const router = express.Router();
//const login = require('../controller/authenticate/login');
const model = require('../model');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signin', passport.authenticate('signin',{
    successRedirect:'/',
    failureRedirect:'/',
    failureFlash:true
}));

/* Login user */
//passport로 해보자. 그전까지 봉인.
/*
router.post('/signin', async function (req, res, next) {
    const email = req.body.email;
    const password=req.body.password;

    let signinResult=await model.User.findOne({
        where:{
            email:email,
            password:password
        }
    });
    
    if (!signinResult) {
         res.render('index', {error: true});
    }
    else {
        const Username=signinResult.dataValues.username;
        req.session.username=Username;
        req.session.user_id=signinResult.dataValues.id;
        req.session.save(()=>{
            res.locals.session=req.session;
            res.locals.session.save(()=>res.redirect('/'))
        });
    }
});
*/

//new sign up
router.post('/signup', passport.authenticate('signup', {
    successRedirect:'/',
    failureRedirect:'/signup',
    failureFlash:true
}));

//Sign up
/*
router.post('/signup', async function(req,res, next){
    const Username=req.body.username;
    const Email=req.body.email;
    const Password=req.body.password;
    const ConfirmPassword=req.body.password2;
    if(Password!==ConfirmPassword) res.render('signup',{error1:false, error2:true});
    else{ //else. 비밀번호 안맞으면 애초에 안되게끔 함
    let signupResult=await model.User.findOrCreate({
        where:{
            email:Email,
        },
        defaults:{
            username:Username,
            email:Email,
            password:Password,
            qcount:0,
            acount:0
        }
    });
    //findOrCreate 반환값은 Array. 찾거나 생성된 정보, 그리고
    //이번에 생성한 것인지에 대한 boolean 값이 있다. 찾아낸게 
    //아니라 생성한거면 true. 찾아낸거면 false.
    console.log(signupResult);
    if(!signupResult[1]) res.render('signup',{error1:true});
    else{
        //alert('Sign Up Success, Go to Sign in Page');
        //req.session.username=Username;
        //console.log()
        //req.session.save(()=>
        //)};
        res.render('index',{error1:false, error2:false})

}}});
*/

//Logout
//in progress~ 이거 get으로 해도 되겠다!
//passport에 맞춰서 다시 만들것.
router.get('/logout',(req,res)=>{
    /*
    console.log(req.session);
    if(req.session.username){
    req.session.destroy(err=>{
        if(err){
            console.log('Session Undead');
            return ;
        }
        console.log('Session Dead');
        console.log(req.session);
        res.redirect('/');
    })};
    */
    req.logout();
    res.redirect('/');
});

module.exports = router;