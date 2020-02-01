//app.js 은 setup 부라고 볼 수 있다. 거의 헤더파일 느낌이라고 말할 수 있을 정도로, require로 미들웨어들 다 가져오고 라우터들도 하나하나 여기서 규정.

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bodyParser=require('body-parser');
const app = express();
const session=require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(session({
  secret:'ThisisSecretCodeButIdontKnowWhatIhavetowritein',
  resave:false,
  saveUninitialized:true
}));


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
