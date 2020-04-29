//libs
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const assert = require('assert');



//response headers
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//public folder for resources
app.use(express.static('public'))

app.use(express.json()); 
app.use( bodyParser.json() );

app.get('/api', (req, res) => {
	res.json({
		message: "Got Hi."
	});
});
app.post('/api', (req, res) => {
	res.json({
		message: "Posted Hi."
	});
});
app.put('/api', (req, res) => {
	res.json({
		message: "Put Hi."
	});
});
app.delete('/api', (req, res) => {
	res.json({
		message: "Deleted Hi."
	});
});

app.get('/api/chat', (req, res) => {
	chatCollection.find({}).toArray(function(err, items) {
		res.json({
			chats:items
		});
	});
});
app.post('/api/chat', (req, res) => {
	console.log(req.body.name+" says "+req.body.message);
	var messageObject = {
		"name":req.body.name,
		"message":req.body.message,
		"date": new Date()
	}
	chatCollection.insertOne(messageObject);
	res.json({
		message: req.body.name+" says "+req.body.message
	});
});
app.put('/api/chat', (req, res) => {
	res.json({
		message: "Put chat."
	});
});
app.delete('/api/chat', (req, res) => {
	var idToDelete = req.body._id;

	chatCollection.deleteOne({_id:idToDelete}, function(err, obj) {
		if (err) throw err;
		console.log("1 document deleted: "+idToDelete);
		res.json({
			message: "Deleted "+idToDelete
		});
	  });
});


/*
//if you don't need mongo, you can just open a server directly
app.listen(8080, function() {
	console.log('Listening on port 8080...')
});
*/


//mongo
var MongoClient = require('mongodb').MongoClient;
var connectionString = 'mongodb://localhost:27017/chatDB';
var db;
var chatDB;
var chatCollection;

// Connect to Mongo on start
MongoClient.connect(connectionString, function(err, mdb) {
	assert.equal(null, err);
  if (err) {
	console.log('Unable to connect to Mongo.')
	process.exit(1)
  } else {
	//switch to your db.
	chatDB = mdb.db("chatDB");
	chatCollection = chatDB.collection("chatCollection");
	//listen on a port
    app.listen(80, function() {
      console.log('Listening on port 80...')
    })
  }
})
