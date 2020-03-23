const model=require('../model');

//질문자, 답변자를 req.qUser, req.aUser 으로 넣어줌.

module.exports={
    whoQuestion:async function(req,res,next){
        const post=await model.Question.findOne({
            where:{id:req.params.qid},
            include:[model.User]
        });
        req.qUser=post.user;
        next();
    },

    whoAnswer:async function(req,res,next){
        const answer=await model.Answer.findOne({
            where:{id:req.params.aid},
            include:[model.User]
        });
        req.aUser=answer.user;
        next();
    }
}