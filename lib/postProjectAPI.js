//Post Project
/*Author Ronald Butron Salvatierra*/
var expect= require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

var endPoint='https://www.pivotaltracker.com/services/v5/projects';
var proxy='http://172.20.240.5:8080';

var createProject=function(prj, callback) {
	
	request
		.post(endPoint)
		.proxy(proxy)
		.set('X-TrackerToken','0a25c5acfacfb46cdf114252c93ed468')
		.set('Content-Type', 'application/json' )
		.send(prj)
		.end(function(err, res) {
			
			if (err) {
				console.log('Error Create Project'+JSON.stringify(res.body));
			}
			else{
				console.log('Project Created'+JSON.stringify(res.body));
			}
			callback(res);
		});	
};

exports.createProject=createProject;