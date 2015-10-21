//Delete Task
/*Author Ronald Butron Salvatierra*/
var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json');

var storiesTasksEndPoint = endPoints.storiesTasksEndPoint;
var storiesTasksByIdEndPoint = endPoints.storiesTasksByIdEndPoint;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type=config.type;
var appJson=config.json;

var deleteTask = function (projectId, storyId, idTask, callback) {
	var  endPoint = storiesTasksByIdEndPoint.replace('{project_id}', projectId)
											.replace('{story_id}', storyId)
											.replace('{task_id}', idTask);
		request
		.del(endPoint)
		//.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.end(function (err, res) {
			if (err) {
				console.log('Error Delete Task' + JSON.stringify(err));
			}
			else{
				console.log('Task Deleted ' + JSON.stringify(res.body));
			}
		callback(res);

		});
}
exports.deleteTask = deleteTask;

var getTask = function (projectId, storyId, taskId, callback) {
	
	if(taskId == -1){
	var endPoint = storiesTasksEndPoint.replace('{project_id}', projectId)
									   .replace('{story_id}', storyId);
	request
		.get(endPoint)
		//.proxy(proxy)
		.set(tokenHeader, token)
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
		var endPoint = storiesTasksByIdEndPoint.replace('{project_id}', projectId)
												.replace('{story_id}', storyId)
												.replace('{task_id}', taskId);
		request
			.get(endPoint)
			//.proxy(proxy)
			.set(tokenHeader, token)
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

exports.getTask = getTask;

var createTask = function(argument, projectId, storyId, callback) {
	var endPoint = storiesTasksEndPoint.replace('{project_id}', projectId)
									   .replace('{story_id}', storyId);
    request
        .post(endPoint)
        //.proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(argument)
        .end(function(err, res) {
            if (err) {
                console.log('Error Create Task' + JSON.stringify(res.body));
            } 
            else {
                console.log('Task Created' + JSON.stringify(res.body));
            }
            callback(res);

        });

}

exports.createTask = createTask;

var editTask = function(argument, projectId, storyId, taskId, callback) {
	var endPoint = storiesTasksByIdEndPoint.replace('{project_id}', projectId)
										   .replace('{story_id}', storyId)
										   .replace('{task_id}', taskId);
    request
        .put(endPoint)
        //.proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(argument)
        .end(function(err, res) {
            if (err) {
                console.log('Error Edit Task' + JSON.stringify(err));
            } 
            else {
                console.log('Task Edited' + JSON.stringify(res.body));
            }
            callback(res);

        });

}

exports.editTask = editTask;
