const express = require('express');
const router = express.Router();
const auth=require('../../controller/auth');
const data=require('../../controller/data');

//--------------------Code Q&A------------------------
router.get('/',auth.isLogin,function(req,res,next){
    res.redirect('/board/codeqna/list/1');
});

//codeqna 게시판 리스트 띄우기
router.get('/:page', auth.isLogin, data.getPostsList, data.countAnswersOfQuestions, function(req,res,next){
    console.log(req.posts);
    res.render('codeqna',{rows:req.posts,pagenum:req.params.page});
});

module.exports=router;