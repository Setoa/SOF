//그리고 index.pug 에서 post한 아이디 비번 가져오고 login.js 부에서 아이디 비번 참거짓 판단 해온다. 참일시 users.pug로 이동.(나중에 home.pug 로 대체)
//아닐 시 index.pug 안에서 에러 도출. 

const express = require('express');
const router = express.Router();
//const login = require('../controller/authenticate/login');
const model = require('../model');
const app=require('../app')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* Login user */
router.post('/signin', async function (req, res, next) {
    const email = req.body.email;
    const password=req.body.password;
    //원래는 login.js 가서 결과 떼오는 방식으로 하려고 했는데
    //왜 안되는지 모르겠다. 나중에 한번 시도해볼것.
    //const signinResult = login(email, password);
    /*
    const login = function(email,password){
        model.User.findOne({
            where:{
                email:email,
                password:password
        }}).then(res=>{
            return res;
        })};
    */

    let signinResult=await model.User.findOne({
        where:{
            email:email,
            password:password
        }
    });
    const Username=signinResult.dataValues.username;
    console.log(signinResult); //디비에서 잘 찾아왔는지 확인 용도
    if (!signinResult) {
        //-
         res.render('index', {error: true});
    }
    else {
        req.session.username=Username;
        console.log(Username);
        res.render('users', {username: Username});
    }
});

//Sign up
router.post('/signup', async function(req,res, next){
    const Username=req.body.username;
    const Email=req.body.email;
    const Password=req.body.password1;
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
            password:Password
        }
    });
    //findOrCreate 반환값은 Array. 찾거나 생성된 정보, 그리고
    //이번에 생성한 것인지에 대한 boolean 값이 있다. 찾아낸게 
    //아니라 생성한거면 true. 찾아낸거면 false.
    console.log(signupResult);
    if(!signupResult[1]) res.render('signup',{error1:true});
    else{
        //alert('Sign Up Success, Go to Sign in Page');
        req.session.username=Username;
        req.session.save(()=>
        res.render('index',{error1:false, error2:false})
        )};
} //else
});

//Logout
//in progress~
router.get('/logout',(req,res)=>{
    delete req.session.username;
    res.redirect('/');
})

module.exports = router;