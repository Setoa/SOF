//const model = require('../model');
//로그인했는지, 또는 질문/답변 에의 접근 권한이 있는지
module.exports={
    isLogin:async function(req,res,next){
        if(!req.user){
            return res.redirect('/');
        }
        next();
    },

    isQwriter:async function(req,res,next){
        if(req.user!==req.qUser){
            return res.redirect(`/codeqna/post/${req.params.qid}`);
        }
        next();
    },

    isAwriter:async function(req,res,next){
        if(req.user!==req.aUser){
            return res.redirect(`/codeqna/post/${req.params.aid}`);
        }
        next();
    }
}