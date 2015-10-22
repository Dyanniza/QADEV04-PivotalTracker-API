/*
@author Jhasmany Quiroz
@Class STORY API
 */

var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('../endPoints');
var config = require('../config');

var endPoint = endPoints.story;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type = config.type;
var appJson = config.json;

/**
 * @param  {ID of the Project to be modified}
 * @param  {ID of the Story will be obtained}
 * @param  {Token of Username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStory = function(projectId, storyId, token, callback){
	var storyOwnersEndPoint = endPoint.storyOwnersEndPoint.replace('{project_id}', projectId);
	storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', storyId);

	request
		.get(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('STORY-API: Error to display the Story ' + storyId + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('GET: '+storyOwnersEndPoint);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.status);
	});
};

exports.getStory = getStory;

/**
 * @param  {ID of the project it belongs to Story}
 * @param  {ID of the Story to be modified}
 * @param  {Token of username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var putStory = function(projectId, storyId, token, callback){
	var storyOwnersEndPoint = endPoint.storyOwnersEndPoint.replace('{project_id}', projectId);
	storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', storyId);

	request
		.put(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.send({'name':'User Story #2 modified by put test'})
	.end(function(err, res){
		if (err) {
			console.log('Error to modified the Story ' + storyId+ ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('PUT: ' +storyOwnersEndPoint);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.body);
	});
};

exports.putStory = putStory;

/**
 * @param  {ID of the project it belongs to Story}
 * @param  {ID of the Story to be deleted}
 * @param  {Token of username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var deleteStory = function(projectId, storyId, token, callback){
	var storyOwnersEndPoint = endPoint.storyOwnersEndPoint.replace('{project_id}', projectId);
	storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', storyId);

	request
		.del(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
	.end(function(err, res){
		if (err) {
			console.log('Error to delete the Story ' + storyId + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('DELETE: '+storyOwnersEndPoint);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.body);
	});
};

exports.deleteStory = deleteStory;

/**
 * @param  {ID of the project it belongs to Story}
 * @param  {ID of the Story will be obtained}
 * @param  {Token of username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getStoryOwner = function(projectId, storyId, token, callback) {
	var storyOwnersEndPoint = endPoint.storyOwnersEndPoint.replace('{project_id}', projectId);
	storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', storyId);	
	request
		.get(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
			console.log('STORY-API: Error to display the Story ' + storyId + ' ... ' + JSON.stringify(res.body));
		} else {
			console.log('GET: '+storyOwnersEndPoint);
			console.log('The story has been Displayed'+JSON.stringify(res.body));
			console.log('STATUS: ', res.status);
		};

		callback(res.status);
	});
};
exports.getStoryOwner = getStoryOwner;

/**
 * @param  {ID of the project it belongs to Story}
 * @param  {ID of the Story will be obtained}
 * @param  {Token of username}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var postStoryOwner = function(owner, projectId, storyId, token, callback){
	var storyOwnersEndPoint = endPoint.storyOwnersEndPoint.replace('{project_id}', projectId);
	storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', storyId);

	request
		.post(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.send(owner)
	.end(function(err, res){
		if (err) {
    	console.log('Error Update Storys Owner' + JSON.stringify(res.body));    	
    } else {
    	console.log('----Storys Owner Updated-----' + JSON.stringify(res.body));
    }

		callback(res.status);
	});
};
exports.postStoryOwner = postStoryOwner;

var deleteStoryOwner = function(owner, projectId, storyId, token, callback){
	var storyOwnerIdEndPoint = endPoint.storyOwnerIdEndPoint.replace('{project_id}', projectId);
	storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('{story_id}', storyId);
	storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('person_id', owner.id);


	request
		.del(storyOwnersEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)		
	.end(function(err, res){
		if (err) {
    	console.log('Error Delete Storys Owner' + JSON.stringify(res.body));    	
    } else {
    	console.log('----Storys Owner Delete-----' + JSON.stringify(res.body));
    }

		callback(res.status);
	});
};
exports.deleteStoryOwner = deleteStoryOwner;

var getStoryId = function(storyId, token, callback){	
	var storyIdEndPoint = endPoint.storyIdEndPoint.replace('{story_id}', storyId);
	request
		.get(storyIdEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
	.end(function(err,res){
		
		if (err) {
    	console.log('Error Get Storys' + JSON.stringify(res.body));    	
    } else {
    	console.log('----Storys Get-----' + JSON.stringify(res.body));
    }
		callback(res.status);
	});
};
exports.getStoryId = getStoryId;

var putStoryId = function(story, storyId, token, callback){
	var storyIdEndPoint = endPoint.storyIdEndPoint.replace('{story_id}', storyId);
	request
		.put(storyIdEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.send(story)
	.end(function(err, res){
		if (err) {
    	console.log('Error to modified the Story' + JSON.stringify(res.body));    	
    } else {
    	console.log('----Storys Update-----' + JSON.stringify(res.body));
    }
		callback(res.status);		
	});
};
exports.putStoryId = putStoryId;

var deleteStoryId = function(storyId, token, callback){
	var storyIdEndPoint = endPoint.storyIdEndPoint.replace('{story_id}', storyId);
	request
		.del(storyIdEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
	.end(function(err, res){
		if (err) {
    	console.log('Error to Delete the Story' + JSON.stringify(res.body));    	
    } else {
    	console.log('----Story Deleted-----' + JSON.stringify(res.body));
    }
		callback(res.status);		
	});
};
exports.deleteStoryId = deleteStoryId;