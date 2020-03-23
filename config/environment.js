//environment.js 의 역할 : 그냥 config 파일.
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const environments={
    development:{
        mysql:{
            username:'root',
            password:process.env.DB_PASSWD,
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