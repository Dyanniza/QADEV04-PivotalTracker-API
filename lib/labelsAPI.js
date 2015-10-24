/*
@author Cecilia Chalar
@class LABELs for Test Cases the Services of Labels.
 */

var request = require('superagent');
require('superagent-proxy')(request);


var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json')
var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsOfProjectEndPoint = endPoints.labels.labelsOfProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;

var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type = config.type;
var appJson = config.json;

var getLabel = function (projectId, storyId, labelId, callback) {
	
	if(labelId == -1){
	request
		.get(labelsProjectEndPoint)
		.proxy(proxy)		
		.set(tokenHeader,token)
		.end(function (err,res) {
			
			if (err) {
				console.log('Error GET Label' + JSON.stringify(res.body));
			}
			else{
				console.log('GET Label' + JSON.stringify(res.body));
			}
			callback(res);
		});
	}
	else{
		request
			.get(labelsOfProjectEndPoint)
			.proxy(proxy)
			.set(tokenHeader,token)
			.end(function (err,res) {

				if (err) {
					console.log('Error GET Label' + JSON.stringify(res.body));
				}
				else {
					console.log('GET label' + JSON.stringify(res.body));
				}
				callback(res);
			});
	}
}
exports.getLabel = getLabel;

var postLabel = function (projectId,codeJson,callback) {
	var endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);	
	console.log(labelsProjectEndPoint);
	
	request
		.post(endPoint)
		.proxy(proxy)
		.set(tokenHeader,token)
		.set(type,appJson)
		.send(codeJson)
		.end(function(err, res){
		    if (err) {
                console.log('Error created label' + JSON.stringify(res.body));
            } 
            else {
                console.log('Label created ..' + JSON.stringify(res.body));
                 }
           callback(res);
		});	
}
exports.postLabel = postLabel;

var putLabel = function (projectId,labelId,codeJson,callback) {
	var endPoint = labelByIdProjectIdEndPoint.replace('{project_id}',projectId).replace('{label_id}',labelId);	
	console.log(labelByIdProjectIdEndPoint);
	
	request
		.put(endPoint)
		.proxy(proxy)
		.set(tokenHeader,token)
		.set(type,appJson)
		.send(codeJson)
		.end(function(err, res){
		    if (err) {
                console.log('Error Updated label' + JSON.stringify(res.body));
            } 
            else {
                console.log('Label Updated' + JSON.stringify(res.body));
                 }
           callback(res);
		});	
}
exports.putLabel = putLabel;


var deleteLabel = function (projectId,storyId,labelId,callback) {

	if(storyId==-1){

		var endPoint = labelByIdProjectIdEndPoint.replace('{project_id}',projectId).replace('{label_id}',labelId);	
		console.log(endPoint);
		
		request
			.del(endPoint)
			.proxy(proxy)
			.set(tokenHeader,token)
			.set(type,appJson)			
			.end(function(err, res){
			    if (err) {
	                console.log('Error Delete label' + JSON.stringify(res.body));
	            } 
	            else {
	                console.log('Label Deleted' + JSON.stringify(res.body));

	                 }
	           callback(res);
			});	


	} else {

		var endPoint = labelIdStoryIdProjectIdEndPoint.replace('{project_id}',projectId).replace('{story_id}',storyId).replace('{label_id}',labelId);	
		console.log(endPoint);
		
		request
			.del(endPoint)
			.proxy(proxy)
			.set(tokenHeader,token)
			.set(type,appJson)			
			.end(function(err, res){
			    if (err) {
	                console.log('Error Delete label' + JSON.stringify(res.body));
	            } 
	            else {
	                console.log('Label Deleted' + JSON.stringify(res.body));
	                 }
	           callback(res);
			});	

	}
}
exports.deleteLabel = deleteLabel;