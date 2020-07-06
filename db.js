var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null,
  }
//connect to database 
exports.connect = function(uri, callback){
    if(state.db) {return callback()}
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function(err, db) {
        if (err) return done(err)
        state.db = db //connect to the client db 
        callback()
      })
}

exports.get = function() {
    return state.db
  }

exports.close = function(callback) {
if (state.db) {
    state.db.close(function(err, result) {
    state.db = null
    callback(err)
    })
}
}