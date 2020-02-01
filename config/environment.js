//environment.js 의 역할 : 그냥 config 파일.

const environments={
    development:{
        mysql:{
            username:'root',
            password:'kaillika01!',
            database:'mydb',
            host:'localhost',
            dialect:'mysql'
        }
    },
    
    production:{

    }
}

const nodeEnv=process.env.NODE_ENV || 'development';

module.exports=environments[nodeEnv];