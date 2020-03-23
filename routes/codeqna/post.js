const express = require('express');
const router = express.Router();
const auth=require('../../controller/auth');
const writer=require('../../controller/writer');
const data=require('../../controller/data');

//게시판 안에서 글쓰기 누를시 나오는 창
router.get('/write', auth.isLogin, function(req,res,next){
    res.render('qwrite',{username:rqe.user.username});
});

//게시물열람
router.get('/:qid', data.getPost, writer.whoQuestion, data.getAnswers, function(req,res,next){
    res.render('qview',{post:req.post.dataValues, answers:req.answers, qUsername:req.qUser.username});
});

//질문글쓰기
router.post('/', auth.isLogin, data.newPost, function(req,res,next){
    res.redirect('/codeqna/list');
});

//글 수정. 글 정보 똑같이 qview 창에 나오게 함. 단, 동작은 write랑 조금 다르게.
router.get('/:qid/update', auth.isLogin, writer.whoQuestion, auth.isQwriter, data.getPost, function(req,res,next){
    res.render('qupdate',{post:req.post.dataValues,username:req.qUser.dataValues.username});
});

router.put('/:qid', auth.isLogin, writer.whoQuestion, auth.isQwriter, data.changePost, function(req,res,next){
    res.redirect(`/codeqna/list/${req.params.qid}`);
});

//글 삭제 - 모든 답변 같이 삭제해준다
router.delete('/:qid', auth.isLogin, writer.whoQuestion, auth.isQwriter , data.boomQuestion, function(req,res,next){
    res.redirect('/codeqna/list');
});

module.exports=router;