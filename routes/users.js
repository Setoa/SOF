//그리고 index.pug 에서 post한 아이디 비번 가져오고 login.js 부에서 아이디 비번 참거짓 판단 해온다. 참일시 users.pug로 이동.(나중에 home.pug 로 대체)
//아닐 시 index.pug 안에서 에러 도출. 

const express = require("express");
const router = express.Router();
const passport=require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.post("/signin", passport.authenticate("signin",{
    successRedirect:"/",
    failureRedirect:"/",
    failureFlash:true
}));

//new sign up
router.post("/signup", passport.authenticate("signup", {
    successRedirect:"/",
    failureRedirect:"/signup",
    failureFlash:true
}));


router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

module.exports = router;