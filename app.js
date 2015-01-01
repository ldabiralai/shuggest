var express = require('express')
var bodyParser = require('body-parser')
require('sugar')


var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));

var mongouri = process.env.MONGOHQ_URL || 'mongodb://localhost/emoe'
var store = require('promised-mongo')(mongouri).collection('store');


app.get("/", function(req, res) {
    res.sendfile('index.html');
});

app.post("/makeSuggestion", function(req, res) {
	if (req.body.username && req.body.suggestion) store.insert(req.body);
    res.send(req.body);
});


app.get("/suggestions/:user", function(req, res) {
	store.find({"username": req.params.user}).toArray(function(err, results){
    	res.json(results);
    });    
});


var server = app.listen(Number(process.env.PORT || 5000), function() {
    console.log('Listening on port %d', server.address().port);
});
