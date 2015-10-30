'use strict';

// index.js
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var envy = require('./lib/envy')();
var Mailer = require('./lib/mailer');
var cors   = require('cors');
var url = require('url');
var env = process.env.NODE_ENV;
require('./lib/mailer').mailer = new Mailer();
require('./lib/db');


//var logfmt = require('logfmt');
var app = express();

app.use(function(req, res, next){
	var host = req.headers['host'];
	var proto = req.headers['x-forwarded-proto'];
	var secure = proto ? proto === 'https' : false;

	if (env !== 'production' || !proto) {
		console.log('currently in',process.env.NODE_ENV);
		console.log('no redirecting to ssl not in production mode');
		return next();
	}
	
	if(secure) {
		return next();
	}

	console.log('attempting to rewrite url to https because im in production mode check: .env for NODE_ENV to disable');
	console.log(req.headers);

	res.redirect(url.format({
		host: host,
		protocol: 'https',
		query: req.query
	}));
	
})

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json({ extended: true })); 

app.post('/contact', require('./app/controllers/contact'));
app.post('/processProfile', require('./app/controllers/processProfile'));

var port = +process.env.PORT;

if (isNaN(port)) {
  port = 5000;
}

app.listen(port, function() {
  console.log('Listening on ' + port);
});