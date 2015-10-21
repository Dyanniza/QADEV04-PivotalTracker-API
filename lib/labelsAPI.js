//Get label
//Author: Cecilia Chalar

var request = require('superagent');
require('superagent-proxy')(request);

var endPoint = 'https://www.pivotaltracker.com/services/v5/projects/';
var proxy = 'http://172.20.240.5:8080';
var projectId = '1447838';

var getLabel = function (projectId, storyId, labelId, callback) {
	
	if(labelId == -1){
	request
		.get(endPoint + projectId + '/stories')
		.proxy(proxy)		
		.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
		.end(function (err,res) {
			
			if (err) {
				console.log('Error GET Task' + JSON.stringify(res.body));
			}
			else{
				console.log('GET Task' + JSON.stringify(res.body));
			}
			callback(res);
		});
	}
	else{
		request
			.get(endPoint + projectId + '/stories/' + storyId + '/tasks/' + labelId)
			.proxy(proxy)
			.set('X-TrackerToken', '0a25c5acfacfb46cdf114252c93ed468')
			.end(function (err,res) {

				if (err) {
					console.log('Error GET Task' + JSON.stringify(res.body));
				}
				else {
					console.log('GET Task' + JSON.stringify(res.body));
				}
				callback(res);
			});
	}
}