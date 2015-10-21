/*
@author Jhasmany Quiroz
@class STORIES API
 */

var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('../endPoints');
var config = require('../config');

var endPoint = endPoints.stories;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type=config.type;
var appJson=config.json;

/**
 * @param  {ID of Project to see}
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStories = function(projectId, token, callback) {
	var storiesEndPoint = endPoint.storiesEndPoint.replace('{project_id}', projectId);
	request
		.get(storiesEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('Error to display the Stories ...' + JSON.stringify(res.body));			
		} else {
			console.log('GET: '+endPoint);
			console.log('The stories has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.status);
	});
};

exports.getStories = getStories;

/**
 * @param  {ID of Project to see}
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var postStories = function(projectId, token, callback) {
	var storiesEndPoint = endPoint.storiesEndPoint.replace('{project_id}', projectId);
	request
		.post(storiesEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.send({'name':'User Story created by API Services'})
	.end(function(err,res){
		
		if(err) {
			console.log('Error to created the Story...' + JSON.stringify(res.body));
		} else {			
			console.log('POST: '+endPoint);
			console.log('The story has been created'+JSON.stringify(res.body));
		}

		callback(res.body);
	});
};

exports.postStories = postStories;