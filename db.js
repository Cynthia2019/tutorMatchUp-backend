var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb+srv://Cynthia:CA2019zryg@@cluster-tutormatchup.oshci.mongodb.net/tutorMatchUp?retryWrites=true&w=majority'

var state = {
    db: null,
  }
//connect to database 
exports.connect = function(uri, done){
    if(state.db) {return done()}
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function(err, db) {
        if (err) return done(err)
        state.db = db
        done()
      })
}

exports.get = function() {
    return state.db
  }

exports.close = function(done) {
if (state.db) {
    state.db.close(function(err, result) {
    state.db = null
    state.mode = null
    done(err)
    })
}
}