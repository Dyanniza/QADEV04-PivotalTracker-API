/*
@author Jhasmany Quiroz
@class STORY API
 */

var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('../endPoints');
var config = require('../config');

var endPoint = endPoints.story;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type=config.type;
var appJson=config.json;

/**
 * @param  {ID of Project to see}
 * @param  {ID of Story to see}
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStory = function(projectId, storyId, token, callback){
	var storyEndPoint = endPoint.storyEndPoint.replace('{project_id}', projectId)+'/'+endPoint.storyEndPoint.replace('{story_id}', storyId);
	request
		.get(storyEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('Error to display the Story ' + storyId + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('GET: '+storyEndPoint);
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
		.set(type, appJson)		
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