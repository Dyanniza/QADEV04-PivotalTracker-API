// Create a Stories
/*Author Ronald Butron Salvatierra*/
var request = require('superagent');
require('superagent-proxy')(request);

var endPoint='https://www.pivotaltracker.com/services/v5/projects/';
var proxy='http://172.20.240.5:8080';

var createStories=function (argument, projectId, callback) {
	
	request
	.post(endPoint+projectId+'/stories')
	.proxy(proxy)
	.set('X-TrackerToken','0a25c5acfacfb46cdf114252c93ed468')
	.set('Content-Type', 'application/json' )
	.send(argument)
	.end(function(err,res){
		if (err) {
			console.log('Error Create Story'+JSON.stringify(res.body));
		}
		else{
			console.log('Story Created'+JSON.stringify(res.body));
		}
		callback(res);

	});
}
exports.createStories=createStories;