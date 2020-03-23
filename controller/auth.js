//const model = require('../model');
//로그인했는지, 또는 질문/답변 에의 접근 권한이 있는지
module.exports={
    isLogin:function(req,res,next){
        if(!req.user){
            return res.redirect('/');
        }
        next();
    },

    isQwriter:function(req,res,next){
        if(req.user.id!==req.qUser.id){
            return res.redirect(`/codeqna/post/${req.params.qid}`);
        }
        next();
    },

    isAwriter:function(req,res,next){
        if(req.user.id!==req.aUser.id){
            return res.redirect(`/codeqna/post/${req.params.qid}`);
        }
        next();
    }
}