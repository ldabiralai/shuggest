var express = require('express')
var bodyParser = require('body-parser')
require('sugar')


var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));

var mongouri = process.env.MONGOLAB_URI || 'mongodb://localhost/mastaf'
var pmongo = require('promised-mongo')
var store = pmongo(mongouri).collection('store');


app.get("/", function(req, res) {
    res.sendfile('index.html');
});

app.post("/makeSuggestion", function(req, res) {
	if (req.body.username && req.body.suggestion) {
		req.body.username = req.body.username.toLowerCase();
		store.insert(req.body);
	}	
    res.send(req.body);
});


app.get("/suggestions/:user", function(req, res) {
	store.find({"username": req.params.user.toLowerCase()}).toArray(function(err, results){
    	res.json(results);
    });    
});

app.post("/remove", function(req, res) {
	store.remove({"_id" : pmongo.ObjectId(req.body.id)}, function(err, results) {
		if (err) console.log(err);
		res.json(results);
	});
});


var server = app.listen(Number(process.env.PORT || 5000), function() {
    console.log('Listening on port %d', server.address().port);
});
