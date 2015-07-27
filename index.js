var MongoClient = require('mongodb').MongoClient

var WebSocket = require('ws'),
  fs = require('fs'),
  path = require('path'),
  ws = new WebSocket('ws://itoilet/changes');

MongoClient.connect(process.env.FLUSH_CAPACITOR_LOG_DB_URL, function(err, db) {
  if (err) {
    throw err;
  }
  console.log("Connected correctly to server");

  var collection = db.collection('events');

  ws.on('message', function(message) {
    var parsed = JSON.parse(message);
    parsed.timestamp = Date.now();

    collection.insert([ parsed ], function(err, result) {
      if (err) {
        console.error('Failed to write to database: %s', err);
      }
      else {
        console.log(JSON.stringify(parsed));
      }
    });
  });
});

