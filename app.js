//app.js 은 setup 부라고 볼 수 있다. 거의 헤더파일 느낌이라고 말할 수 있을 정도로, require로 미들웨어들 다 가져오고 라우터들도 하나하나 여기서 규정.

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const boardRouter = require('./routes/board');
const codeqnaList=require('./routes/codeqna/list');
const codeqnaPost = require('./routes/codeqna/post');
const codeqnaAnswer = require('./routes/codeqna/answer');
const bodyParser=require('body-parser');
const app = express();
const session=require('express-session');
const passport=require('passport');
const passportConfig=require('./passport');
const flash=require('connect-flash');
const methodOverride=require('method-override');
const syncDB=require('./model').sequelize;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:'ThisisSecretCodeButIdontKnowWhatIhavetowritein',
  resave:false,
  saveUninitialized:true,
  cookie:{
    //secure:true,
    secure:false,
    maxAge:24000*60*60
  }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passportConfig();
app.use(methodOverride((req,res)=>{
  if(req.body && typeof req.body==='object' && req.body._method){
    const method = req.body._method;
    console.log('method::',method);
    delete req.body._method;
    return method;
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use('/codeqna/list', codeqnaList);
app.use('/codeqna/post', codeqnaPost);
app.use('/codeqna/post', codeqnaAnswer);


syncDB.sync().then(()=>{
  console.log('DB Synchronized');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
