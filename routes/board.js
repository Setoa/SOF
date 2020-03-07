//codeqna, freetalk, codehub 순
const express = require('express');
const router = express.Router();
const model = require('../model');

router.get('/*', function(req,res,next){
    if(!req.user){
        console.log('not loggined');
        res.redirect('/');
    }
    next();
});

//--------------------Code Q&A
router.get('/codeqna/list',function(req,res,next){
    res.redirect('/board/codeqna/list/1');
});

//codeqna 게시판 리스트 띄우기
router.get('/codeqna/list/:page', async function(req,res,next){
    //페이지마다 10개씩 띄우기.
    const pagenum=req.params.page;
    if(pagenum<1) res.redirect('/board/codeqna/list');
    let offset=(pagenum-1)*10;
    //게시판 리스트에 id writer title answer(답변 수)
    const question=model.Question;
    const qResult=await question.findAndCountAll({include:[model.User],offset:offset,limit:10});
    res.render('codeqna',{rows:qResult,pagenum:pagenum});
});

//게시판 안에서 글쓰기 누를시 나오는 창
router.get('/codeqna/post/write', function(req,res,next){
    const writeuser=req.user.username;
    res.render('qwrite',{username:writeuser});
});

//게시물열람
router.get('/codeqna/post/:num', async function(req,res,next){
    const postnum = req.params.num; //글번호 === qid
    const post=await model.Question.findOne({
        where:{id:postnum}  
    });
    const postData=post.dataValues;
    const quser=await model.User.findOne({
        where:{id:postData.uid}
    });
    const qusername=quser.dataValues.username;
    //답변도 같이들 나오게 했음. findAndCountAll 이용해서 answers 로 넘겨줄 것. 답변 수 페이징 할 거 생각해서 카운트도 만들어놓으려고 findandcountall씀.
    const answers=await model.Answer.findAndCountAll({
        where:{qid:postnum},
        include:[model.User]
    });
    res.render('qview',{post:postData, answers:answers, qusername:qusername});
});



//질문글쓰기
router.post('/codeqna/post', async function(req,res,next){
    const title=req.body.title;
    const content=req.body.content;
    const uid=req.user.id;
    await model.Question.create({
        title:title,
        content:content,
        howAns:0,
        uid:uid
    });
    await model.User.update({
        qcount:model.sequelize.literal('qcount+1')
    },{where:{id:uid}});
    console.log('after q Create');
    res.redirect('/board/codeqna/list');
});

//글 수정. 글 정보 똑같이 qview 창에 나오게 함. 단, 동작은 write랑 조금 다르게.
router.get('/codeqna/post/:num/update', async function(req,res,next){
    //예외처리 넣어줄 것. 사용자가 글쓴이가 맞는지 확인.
    //아닐 시 list로 redirect
    const postnum=req.params.num;
    const post=await model.Question.findOne({
        where:{id:postnum}
    });
    const postData=post.dataValues;
    const postUserId=postData.uid;
    const currentUserId=req.user.id;
    if(currentUserId!==postUserId) {
        console.log('Error. You are not who write this post.');
        return res.redirect(`/board/codeqna/post/${postnum}`);
    }
    const user=await model.User.findOne({
        where:{id:postData.uid}
    });
    const writer=user.dataValues.username;
    res.render('qupdate',{post:postData,username:writer});
});

router.put('/codeqna/post/:num', async function(req,res,next){
    const postnum=req.params.num;
    await model.Question.update({
        title:req.body.title,
        content:req.body.content
    },{where:{id:postnum}});
    console.log('after q update');
    res.redirect(`/board/codeqna/list/${postnum}`);
});

//글 삭제 - 모든 답변 같이 삭제해준다
router.delete('/codeqna/post/:num', async function(req,res,next){
    //예외처리 넣어줄 것. 사용자가 글쓴이가 맞는지 확인.
    //아닐 시 list로 redirect
    const currentUserId=req.user.id;
    const postnum=req.params.num;
    const deletePost=await model.Question.findOne({
        where:{id:postnum}
    });
    const postUserId=deletePost.dataValues.uid;
    if(currentUserId!==postUserId) {
        console.log('Error. You are not who write this post.');
        return res.redirect(`/board/codeqna/post/${postnum}`);
    }
    await model.Question.destroy({
        where:{id:postnum}
    });
    console.log('after q delete');
    const userAns=await model.Answer.count({
        where:{qid:postnum,uid:postUserId}
    });
    await model.Answer.destroy({
        where:{qid:postnum}
    });
    await model.User.update({
        qcount:model.sequelize.literal('qcount-1'),
        acount:model.sequelize.literal(`acount-${userAns}`)
    },{where:{id:postUserId}});
    //user의 qcount와 acount도 줄여주도록 하자.
    console.log('after q_a delete');
    res.redirect('/board/codeqna/list');
});

//codeqna 답변 부
//답변 작성 페이지
router.get('/codeqna/post/:qid/answer/write', async function(req,res,next){
    const qid=req.params.qid;
    const qpost=await model.Question.findOne({where:{id:qid}});
    const qpostResult=qpost.dataValues;
    const quser=await model.User.findOne({where:{id:qpostResult.uid}});
    const qusername=quser.dataValues.username;
    const currentUsername=req.user.username;
    res.render('awrite',{post:qpostResult, username:qusername, currentUsername:currentUsername});
});

//답변 작성
router.post('/codeqna/post/:qid/answer', async function(req,res,next){
    //해당 Question의 howAns +1씩 올려줄것.
    const qid=req.params.qid;
    const title=req.body.atitle;
    const content=req.body.acontent;
    await model.Answer.create({
        title:title,
        content:content,
        uid:req.user.id,
        qid:qid
    });
    await model.Question.update({
        howAns:model.sequelize.literal('howAns+1')
    }, {
        where:{id:qid}
    });
    await model.User.update({
        acount:model.sequelize.literal('acount+1')
    },{
        where:{id:req.user.id}
    });
    res.redirect(`/board/codeqna/post/${qid}`);
});

//답변 수정 창
router.get('/codeqna/post/:qid/answer/:aid/update', async function(req,res,next){
    const qid=req.params.qid;
    const aid=req.params.aid;
    const apost=await model.Answer.findOne({where:{id:aid}});
    const apostResult=apost.dataValues;
    const ansUserId=apostResult.uid;
    const currentUserId=req.user.id;
    if(currentUserId!==ansUserId) {
        console.log('Error. You are not who write this answer.');
        return res.redirect(`/board/codeqna/post/${qid}`);
    }
    const qpost=await model.Question.findOne({where:{id:qid}});
    const qpostResult=qpost.dataValues;
    const quser=await model.User.findOne({where:{id:qpostResult.uid}});
    const qusername=quser.dataValues.username;
    const auser=await model.User.findOne({where:{id:apostResult.uid}});
    const ausername=auser.dataValues.username;
    console.log('this is answer data');
    //console.log(apost);
    console.log('this is answer username');
    //console.log(ausername);
    res.render('aupdate',{post:qpostResult, qusername:qusername, ausername:ausername, answer:apostResult});
});

//답변 수정
router.put('/codeqna/post/:qid/answer/:aid', async function(req,res,next){
    const aid=req.params.aid;
    const title=req.body.atitle;
    const content=req.body.acontent;
    const qid=req.params.qid;
    const currentUserId=req.user.id;
    const ansUser=await model.Answer.findOne({where:{id:aid}});
    const ansUserId=ansUser.dataValues.uid;
    /*  이미 답변수정창 띄울때 작성자 아닐 경우 예외 처리 해줌.
    if(currentUserId!==ansUserId){
        console.log('you did not answer');
        return res.redirect(`/board/codeqna/post/${qid}`);
    }
    */
    await model.Answer.update({
        title:title,
        content:content
    },{where:{id:aid}});
    console.log('after a update');
    res.redirect(`/board/codeqna/post/${qid}`);
});

//답변 삭제
router.delete('/codeqna/post/:qid/answer/:aid', async function(req,res,next){
    const currentUserId=req.user.id;
    const qid=req.params.qid;
    const aid=req.params.aid;
    const ans=await model.Answer.findOne({
        where:{id:aid}
    });
    const ansUserId=ans.dataValues.uid;
    if(currentUserId!==ansUserId) {
        console.log('Error. You are not who write this answer.');
        return res.redirect(`/board/codeqna/post/${qid}`);
    }
    await model.Answer.destroy({
        where:{id:aid}
    });
    await model.User.update({
        acount:model.sequelize.literal('acount-1')
    },{where:{id:ansUserId}});
    console.log('after a delete');
    res.redirect(`/board/codeqna/post/${qid}`);
});

//Free Talk
router.get('/freetalk/list',function(req,res,next){
    res.redirect('/board/freetalk/list/1');
});

router.get('/freetalk/list/:page',function(req,res,next){
    const page=req.params.page;
    res.render('freetalk');
    
});

//Code Hub
router.get('/codehub/list',function(req,res,next){
    res.redirect('/board/codehub/list/1');
});

router.get('/codehub/list/:page',function(req,res,next){
    const page=req.params.page;
    //`````
    
});

module.exports=router;