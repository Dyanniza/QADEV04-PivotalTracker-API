/*
@author Jhasmany Quiroz
@class STORIES API
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
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStories = function(projectID, token, callback){
	request
		.get(endPoint + projectID + '/stories/')		
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('Error to display the Stories ...' + JSON.stringify(res.body));			
		} else {
			console.log('GET: '+endPoint+projectID+'/stories/');
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
var postStories = function(projectID, token, callback){
	request
		.post(endPoint + projectID + '/stories/')		
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(contType, contTypeRes)
		.send({'name':'User Story created by API Services'})
	.end(function(err,res){
		
		if(err) {
			console.log('Error to created the Story...' + JSON.stringify(res.body));
		} else {			
			console.log('POST: '+endPoint + projectID + '/stories/');
			console.log('The story has been created'+JSON.stringify(res.body));
		}

		callback(res.body);
	});
};

exports.postStories = postStories;