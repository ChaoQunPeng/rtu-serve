var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require("fs");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dayjs = require("dayjs");

const { exec } = require("./db/mysql");
const { ErrorModel } = require("./model/response-body");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const skillRouter = require('./routes/skill');
const experienceRouter = require('./routes/experience');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/skill', skillRouter);
app.use('/api/experience', experienceRouter);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  // 不知道要不要存到表里，就先存到文件吧
  // let sql = ``;
  // exec(sql).then();

  // // create a write stream (in append mode) 先不用下面这个了吧。。
  // var accessLogStream = fs.createWriteStream(path.join(__dirname+'\\log\\', 'access.log'), { flags: 'a' })
  // // setup the logger
  // app.use(logger('combined', { stream: accessLogStream }))
  console.log('程序出现错误，准备写入日志！');
  writeLogInFile(err, req, res);
  
  console.log(err);
  res.json(new ErrorModel(
    500,
    err.msg ? err.msg : "程序出现错误！",
    err
  ));

});

async function writeLogInFile(err, req, res) {
  let date = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let data = {
    content: err,
    method: req.method,
    date: date,
    userId: 0
  };

  await write(`${__dirname}\\log\\log.json`, JSON.stringify(data) + ",", { 'flag': 'a' });
}

function write(path, data, options = {}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, options, err => {
      if (err) {
        reject(err);
      }
      resolve(
        console.log("错误日志已写入")
      );
    })
  });
}

// function writeLogInFile(err, req, res) {
//   let data = {
//     content: err,
//     method: req.method,
//     date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//     userId: 0
//   };

//   fs.writeFile(`${__dirname}\\log\\log.json`, JSON.stringify(data) + ",", { 'flag': 'a' }, (err) => {
//     console.log('写入异常！');
//     console.log(err);
//   })
// }


module.exports = app;
