'use strict';

var mailer = require('../../lib/mailer').mailer;
module.exports = function ContactController(req, res) {
	var responseData = {
			error: true
		},
		data = req.body;

	mailer.send(data, function(err, response) {
		console.log(err, response);
		if (!err) {
			responseData.error = false;
			responseData.result = response;
		} else {
			console.log(response);
		}

		res.json(responseData);
	});
};