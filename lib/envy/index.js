'use strict';

// injects .env into process.env

var fs = require('fs');
var pjoin = require('path').join;

module.exports = function envy() {

	try {
		fs.statSync('.env');
	} catch(e){
		return;
	}
	

    var _env = fs.readFileSync(pjoin(process.cwd(),'.env'), 'utf8');

    _env = _env.split('\n').forEach(function(line){
        if (line.indexOf('=== ') === -1 && line.trim() !== '') {
            var envVar = line.split(': ');
            if (envVar[0] !== void 0 && envVar[1] !== void 0) {
                process.env[envVar[0].trim()] = envVar[1].trim();
            }
        }
    });
};