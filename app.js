var createError = require('http-errors');
const express = require('express');
var path = require('path');
var http = require('http');

//Middleware to handle cookies
const cookieParser = require('cookie-parser');
var logger = require('morgan');

// Allow cross origin resource sharing 
const cors = require('cors');
const corsConfig = {
  origin: true,  // enable request origin
  credentials: true  // send cookies with cors
}

const {authenticate} = require('./controllers/auth')

//ROUTES
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tutorRouter = require('./routes/tutors')
const authRouter = require('./routes/auth');
const registerRouter = require('./routes/register')

const app = express();


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


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');


//module.exports = app;
//connect to database and start the server
const db = require('./db')
db.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.log('Cannot connect to MongoDB', err)
    process.exit(1)
  }
  app.set('port', port);
  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
})


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`Listening on port ${port}`)
}
