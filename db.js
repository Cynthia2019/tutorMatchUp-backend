var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null,
  }
//connect to database 
exports.connect = function(uri, done){
    if(state.db) {return done()}
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(function(err, db) {
        if (err) return done(err)
        state.db = db //connect to the client db 
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
    done(err)
    })
}
}