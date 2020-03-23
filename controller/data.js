const model=require('../model');

module.exports={
    getPostsList:async function(req,res,next){
        if(req.params.page<1) return res.redirect('/board/codeqna/list');
        const posts=await model.Question.findAndCountAll({
            include:[model.User],
            offset:(req.params.page-1)*10,
            limit:10
        });
        req.posts=posts;
        next();
    },

    getPost:async function(req,res,next){
        const post=await model.Question.findOne({
            where:{id:req.params.qid}
        });
        req.post=post;
        next();
    },

    getAnswers:async function(req,res,next){
        const answers=await model.Answer.findAndCountAll({
            where:{qid:req.params.qid},
            include:[model.User]
        });
        req.answers=answers;
        next();
    },

    getAnswer:async function(req,res,next){
        const answer=await model.Answer.findOne({
            where:{id:req.params.aid}
        });
        req.answer=answer;
        next();
    },

    countQuestionsOfUser:async function(req,res,next){
        const qcount=await model.Question.count({
            where:{uid:req.user.id}
        });
        req.user.qcount=qcount;
        next();
    },

    countAnswersOfUser:async function(req,res,next){
        const acount=await model.Answer.count({
            where:{uid:req.user.id}
        });
        req.user.acount=acount;
        next();
    },

    countAnswersOfQuestions:async function(req,res,next){
        for(let i=0; i<req.posts.count; i++){
            let ansOfQuestion=await model.Answer.count({
                where:{qid:req.posts.rows[i].dataValues.id}
            });
            req.posts.rows[i].dataValues.ansOfQuestion=ansOfQuestion;
        }
        next();
    },

    newPost:async function(req,res,next){
        await model.Question.create({
            title:req.body.title,
            content:req.body.content,
            howAns:0,
            uid:req.user.id
        });
        await model.User.update({
            qcount:model.sequelize.literal('qcount+1')
        },{where:{id:req.user.id}});
        next();
    },

    newAnswer:async function(req,res,next){
        await model.Answer.create({
            title:req.body.atitle,
            content:req.body.acontent,
            uid:req.user.id,
            qid:req.params.qid
        });
        await model.Question.update({
            howAns:model.sequelize.literal('howAns+1')
        },{
            where:{id:req.params.qid}
        });
        await model.User.update({
            acount:model.sequelize.literal('acount+1')
        },{
            where:{id:req.user.id}
        });
        next();
    },

    changePost:async function(req,res,next){
        await model.Question.update({
            title:req.body.title,
            content:req.body.content
        },{
            where:{id:req.params.qid}
        });
        next();
    },

    changeAnswer:async function(req,res,next){
        await model.Answer.update({
            title:req.body.atitle,
            content:req.body.acontent
        }, {
            where:{id:req.params.aid}
        });
        next();
    },

    boomQuestion:async function(req,res,next){
        await model.Question.destroy({
            where:{id:req.params.qid}
        });
        const userAns=await model.Answer.count({
            where:{qid:req.params.qid,uid:req.user.id}
        });
        await model.Answer.destroy({
            where:{qid:req.params.qid}
        });
        await model.User.update({
            qcount:model.sequelize.literal('qcount-1'),
            acount:model.sequelize.literal(`acount-${userAns}`)
        },{where:{id:req.user.id}});
        next();
    },

    boomAnswer:async function(req,res,next){
        await model.Answer.destroy({
            where:{id:req.params.aid}
        });
        await model.User.update({
            acount:model.sequelize.literal('acount-1')
        },{
            where:{id:req.aUser.id}
        });
        next();
    }
}