var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./controller/routes.js');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use('/', routes);
app.use(express.static('./client'));

var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
	console.log("Ready...Connect to localhost:3000");
});
