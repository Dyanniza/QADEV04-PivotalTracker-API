/*
@author Cecilia Chalar
@class LABELs for Test Cases the Services of Labels.
 */

var request = require('superagent');
require('superagent-proxy')(request);

var endPointss = 'https://www.pivotaltracker.com/services/v5/projects/{project_id}/labels';

var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json')
var labelsProjectEndPoint = endPoints.labelsProjectEndPoint;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type=config.type;
var appJson=config.json;

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
exports.getLabel = getLabel;

var postLabel = function (projectId,codeJson,callback) {
	//var endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
	var endPoint =endPointss.replace('{project_id}',projectId);
	console.log(labelsProjectEndPoint);
	
	request
		.post(endPoint)
		//.proxy(proxy)
		.set(tokenHeader,token)
		.set(type,appJson)
		.send(codeJson)
		.end(function(err, res){
		    if (err) {
                console.log('Error Create Task' + JSON.stringify(res.body));
            } 
            else {
                console.log('Task Created' + JSON.stringify(res.body));            }
           callback(res);
		});	
}
exports.postLabel = postLabel;