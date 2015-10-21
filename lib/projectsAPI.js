//Methods project


var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json');

var projectByIdEndPoint = endPoints.projectByIdEndPoint;
var projectsEndPoint = endPoints.projectsEndPoint;
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var token = config.token;
var type=config.type;
var appJson=config.json;

var deleteProject = function(id, callback){
	var prjByIdEndPoint = projectByIdEndPoint.replace('{project_id}', id);

	request
		.del(prjByIdEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.end(function (err,res) {
			if (err) {
				console.log('Error Create Project'+JSON.stringify(res.body));
			}	

			callback(res);		
		});
};

exports.deleteProject = deleteProject;

var getProject = function (id, callback) {

	if (id == -1) {
		request
			.get(projectsEndPoint)
			.proxy(proxy)
			.set(tokenHeader, token)
			.end(function(err, res){
				if (err) {
					console.log('Error Get Project'+JSON.stringify(res.body));
				} 
				else {
					console.log(' Get Project '+JSON.stringify(res.body));
				}

				callback(res);
			});
	}
	else{
		var prjByIdEndPoint = projectByIdEndPoint.replace('{project_id}', id);
		request
			.get(prjByIdEndPoint)
			.proxy(proxy)
			.set(tokenHeader, token)
			.end(function(err, res){
				if (err) {
					console.log('Error Get Project'+JSON.stringify(res.body));
				} else{
					console.log(' Get Project '+JSON.stringify(res.body));
				};
				callback(res);
			});
	};
	
}

exports.getProject = getProject;

var createProject = function(prj, callback) {

    request
        .post(projectsEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(prj)
        .end(function(err, res) {

            if (err) {
                console.log('Error Create Project' + JSON.stringify(res.body));
            } else {
                console.log('Project Created' + JSON.stringify(res.body));
            }
            callback(res);
        });
};

exports.createProject = createProject;

var editProject = function(argument, id, callback) {
	var prjByIdEndPoint = projectByIdEndPoint.replace('{project_id}', id);
    request
        .put(prjByIdEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(argument)
        .end(function(err, res) {

            if (err) {
                console.log('Error Update Project' + JSON.stringify(res.body));
            } else {
                console.log('Project Updated' + JSON.stringify(res.body));
            }
            callback(res);
        });

}
exports.editProject = editProject;