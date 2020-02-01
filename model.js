//model.js 는 내가 쓸 데이터들의 모델에 대해 규정. 즉, 내가 쓰는 데이터 중 User을 예시로 들어보면, 이름, 이메일, 패스워드가 있지않나.
//그 User가 어떤 모델인지 양식을 이용해 변수 취급해서 써놓는거다. 다른데에서 require 조져서 쓸 수 있게.
//이 과정에서 sequelize 사용!

const config=require('./config/environment').mysql;
const Sequelize=require('sequelize');
const sequelize=new Sequelize(config.database, config.username, config.password,config);

const User=sequelize.define('user',{
    username:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    }

}, 
{
    timestamps:false,
    freezeTableName:true    //이 시퀄라이즈 Ssibalum은 지 맘대로 복수형으로 테이블명에 s 를 붙여버린다. 이름 바꾸기 싫으면 이걸 넣어주자. Freeze! 
});
// 밑에 Board 관련한 것은 나중에 만들고 나서 처리할 예정.
/*
const qBoard=sequelize.define('question',{
    title:{
        type:Sequelize.STRING,
        allowNull=false
    },
    content:{
        type:Sequelize.TEXT,
        allowNull=true
    },
    {
        timestamps:false,
        freezeTableName:true
    }
});  //질문게시글

const aBoard=sequelize.define('answer',{
    title:{
        type:Sequelize.STRING,
        allowNull=false
    },
    content:{
        type:Sequelize.TEXT,
        allowNull=true
    },
    {
        timestamps:false,
        freezeTableName:true
    }
});  //답변게시글
*/

/*
const db={};

db.sequelize=sequelize;
db.Sequelize=Sequelize;
db.User=User;
db.qBoard=qBoard;
db.aBoard=aBoard;
*/

module.exports={
    sequelize:sequelize,
    User:User,
    //Question:qBoard,
    //Answer:aBoard
};