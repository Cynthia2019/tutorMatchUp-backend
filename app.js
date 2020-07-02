var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uri = 'mongodb+srv://Cynthia:CA2019zryg@@cluster-tutormatchup.oshci.mongodb.net/tutorMatchUp?retryWrites=true&w=majority'
const port = process.env.PORT || '3001'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//connect to database 
var db = require('./db')
db.connect(uri, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(port, function() {
      console.log('Listening on port 3001...')
    })
  }
})
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

//check if using heroku 
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('/Users/yujiaxie/Desktop/northwestern/dot_dev/tutor/build'))
    app.get('*', (req, res)=>{
        res.sendFile('/Users/yujiaxie/Desktop/northwestern/dot_dev/tutor/build/index.html')
    })
}

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
