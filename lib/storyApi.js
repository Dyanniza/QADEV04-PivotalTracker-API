/*
@author Jhasmany Quiroz
@class STORY API
 */

var request = require('superagent');
require('superagent-proxy')(request);

var endPoint = 'https://www.pivotaltracker.com/services/v5/projects/';
var proxy = 'http://172.20.240.5:8080';
var tokenHeader = 'X-TrackerToken';

var contType = 'Content-Type';
var contTypeRes = 'application/json';

/**
 * @param  {ID of Project to see}
 * @param  {ID of Story to see}
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStory = function(projectID, storyID, token, callback){
	request
		.get(endPoint + projectID + '/stories/' + storyID)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('Error to display the Story ' + storyID + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('GET: '+endPoint+projectID+'/stories/'+storyID);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.status);
	});
};

exports.getStory = getStory;

var putStory = function(projectID, storyID, token, callback){
	request		
		.put(endPoint + projectID + '/stories' + storyID)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(contType, contTypeRes)
		.send({'name':'User Story #2 modified by put test'})
	.end(function(err, res){
		if (err) {
			console.log('Error to display the Story ' + storyID + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('PUT: '+endPoint+projectID+'/stories/'+storyID);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.body);		
	});
};

exports.putStory = putStory;

var deleteStory = function(projectID, storyID, token, callback){
	request		
		.del(endPoint + projectID + '/stories' + storyID)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(contType, contTypeRes)		
	.end(function(err, res){
		if (err) {
			console.log('Error to delete the Story ' + storyID + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('DELETE: '+endPoint+projectID+'/stories/'+storyID);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.body);		
	});
};

exports.deleteStory = deleteStory;