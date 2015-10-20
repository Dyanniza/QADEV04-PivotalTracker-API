//get 
/*Author Ronald Butron Salvatierra*/
var request = require('superagent');
require('superagent-proxy')(request);

var endPoint='https://www.pivotaltracker.com/services/v5/projects';
var proxy='http://172.20.240.5:8080';

var getProject=function (prj, callback) {

	if (prj==-1) {
		request
		.get(endPoint)
		.proxy(proxy)
		.set('X-TrackerToken','0a25c5acfacfb46cdf114252c93ed468')
		.end(function(err, res){
			if (err) {
				console.log('Error Get Project'+JSON.stringify(res.body));
			} else{
				console.log(' Get Project '+JSON.stringify(res.body));
			};

			callback(res);
					
		});

	}
	else{

		request
		.get(endPoint+'/'+prj)
		.proxy(proxy)
		.set('X-TrackerToken','0a25c5acfacfb46cdf114252c93ed468')
		.end(function(err, res){
			if (err) {
				console.log('Error Get Project'+JSON.stringify(res.body));
			} else{
				console.log(' Get Project '+JSON.stringify(res.body));
			};

			callback(res);
					
		});

	};
	
}

exports.getProject=getProject;