var express = require('express')
var bodyParser = require('body-parser')
require('sugar')
var escape = require("html-escape");
var request = require('request');


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
	if (req.body.fbid && req.body.suggestion) {
		req.body.fbid = escape(req.body.fbid);
		req.body.fbname = escape(req.body.fbname);
		req.body.suggestion = escape(req.body.suggestion);
		req.body.url = escape(req.body.url);
		req.body.fromfbid = escape(req.body.fromfbid);
		req.body.fromfbname = escape(req.body.fromfbname);
		store.insert(req.body);
	}	
    request({
    	url: 'http://shuggest-notifications.herokuapp.com/',
    	method: "POST", 
    	json: req.body 
    }, function(a,b) {
      console.log(a);
      console.log(b);
    });
    res.send(req.body);
});


app.get("/suggestions/:fbid", function(req, res) {
	store.find({"fbid": req.params.fbid}).toArray(function(err, results){
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
