const express = require('express');
const router = express.Router();
const auth=require('../../controller/auth');
const writer=require('../../controller/writer');
const data=require('../../controller/data');

router.get('/:qid/answer/write', auth.isLogin, writer.whoQuestion, data.getPost, function(req,res,next){
    res.render('awrite',{post:req.post.dataValues, username:req.qUser.username, currentUsername:req.user.username});
});

//답변 작성
router.post('/:qid/answer/', auth.isLogin, data.newAnswer, function(req,res,next){
    res.redirect(`/codeqna/post/${req.params.qid}`);
});

//답변 수정 창
router.get('/:qid/answer/:aid/update', auth.isLogin, writer.whoQuestion, writer.whoAnswer, auth.isAwriter, data.getPost, data.getAnswer, function(req,res,next){
    res.render('aupdate',{post:req.post.dataValues, qusername:req.qUser.username, ausername:req.aUser.username, answer:req.answer});
});

//답변 수정
router.put('/:qid/answer/:aid', auth.isLogin, writer.whoAnswer, auth.isAwriter, data.changeAnswer, function(req,res,next){
    res.redirect(`/codeqna/post/${req.params.qid}`);
});

//답변 삭제
router.delete('/:qid/answer/:aid', auth.isLogin, writer.whoAnswer, auth.isAwriter, data.boomAnswer, function(req,res,next){
    res.redirect(`/codeqna/post/${req.params.qid}`);
});

module.exports=router;