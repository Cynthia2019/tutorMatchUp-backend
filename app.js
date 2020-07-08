var createError = require('http-errors');
var express = require('express');
var path = require('path');

//Middleware to handle cookies
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//MongoDB uri
var uri = 'mongodb+srv://Cynthia:CA2019zryg@@cluster-tutormatchup.oshci.mongodb.net/tutorMatchUp?retryWrites=true&w=majority'
const port = process.env.PORT || 5000

// Allow cross origin resource sharing 
const cors = require('cors');
const corsConfig = {
  origin: true,  // enable request origin
  credentials: true  // send cookies with cors
}

const {authenticate} = require('./controllers/auth')

//ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tutorRouter = require('./routes/tutors')
var authRouter = require('./routes/auth');
var registerRouter = require('./routes/register')

var app = express();

//connect to database and start the server
var db = require('./db')
db.connect(process.env.MONGODB_URI || uri, function(err) {
  console.log(process.env.MONGODB_URI)
  if (err) {
    console.log('Cannot connect to MongoDB', error)
    process.exit(1)
  } else {
    app.listen(port, function() {
      console.log(`Listening on port ${port}`)
    })
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); //parse json bodies
app.use(express.urlencoded({ extended: false })); //parse urlencode form bodies
app.use(cookieParser()); //read and write cookies
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsConfig)) // set cors headers
app.use(authenticate); // adds user information to request if authentication exists

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tutors', tutorRouter)
app.use('/auth', authRouter);
app.use('/register',registerRouter)

// //check if using heroku 

// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   app.get('*', (req, res) => {
//     res.sendfile(path.join(__dirname = 'client/build/index.html'));
//   })
// }
// Reads environment variables from env file
// Omitted in production environment
if (process.env.NODE_ENV !== 'production') {
  console.log('dev mode')
  require('dotenv').config();
}


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


//module.exports = app;
