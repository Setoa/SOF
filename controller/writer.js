const model=require('../model');

//질문자, 답변자를 req.qUser, req.aUser 으로 넣어줌.

module.exports={
    whoQuestion:async function(req,res,next){
        const qid=req.params.qid;
        const post=await model.Question.findOne({
            where:{id:qid},
            include:[model.User]
        });
        const qUser=post.user;
        req.qUser=qUser;
        next();
    },

    whoAnswer:async function(req,res,next){
        const qid=req.params.qid;
        const aid=req.params.aid;
        const answer=await model.Answer.findOne({
            where:{id:aid},
            include:[model.User]
        });
        const aUser=answer.user;
        req.aUser=aUser;
        next();
    }
}