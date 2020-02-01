/* 무슨 문제인지 파악이 안된다. 동기비동기문제 발생

//login.js 의 역할 : index.pug에서 때린 email과 password를 바탕으로 db의 데이터와 분석. 즉, 입력값 아이디 비번들이 맞는지 틀린지 참거짓값을 넘겨준다.


//const User=model.User;
const login = function(email,password){
   model.User.findOne({
        where:{
            email:email,
            password:password
    }}).then(res=>{
        console.log(res);
        console.log(res.dataValues);
        console.log(res.dataValues.username);
        return res;
    });

        if(user==="admin@admin.com" && password==="admin"){
            return true;
        }
        else{
            return false;
        }

    }
    module.exports=login;
*/