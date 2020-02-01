//처음 주소 들어갔을때 자연스럽게 GET 요청하는 데이터 처리. 즉, 주소 쳤을때 첫 페이지를 띄워줌.

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.session.username);
  if(req.session){
    res.render('users',{username:req.session.username});
  }
  else res.render('index', { error: false });
});

router.get('/signup',function(req,res,next){
  res.render('signup');
});

module.exports = router;
