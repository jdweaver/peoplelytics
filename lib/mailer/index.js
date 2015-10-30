'use strict';

var nodemailer = require('nodemailer');

function initMailer(){
    var envData = process.env;

    var smtp = { 
        host: envData.EMAIL_SMTP_HOST, 
        user: envData.EMAIL_SMTP_USERNAME, 
        pass: envData.EMAIL_SMTP_PASSWORD,
        port: envData.EMAIL_SMTP_PORTCODE
    };
    
    var transport = nodemailer.createTransport('SMTP', {
        host: smtp.host,
        port: smtp.port,
        auth: {
            user: smtp.user,
            pass: smtp.pass
        }
    });
        
    return transport;
}



function Mailer() {
	var emailTransport = initMailer();

	this.send = function send(data, cb) {
		if (!emailTransport) {
			emailTransport = initMailer();
		}

		var emailData = {
			to: 'joshua@peoplelytics.co',
			from: data.name + ' <' + data.email + '>',
			subject: data.subject,
			text: data.message
		};

		emailTransport.sendMail(emailData, cb);
	};
}

module.exports = Mailer;