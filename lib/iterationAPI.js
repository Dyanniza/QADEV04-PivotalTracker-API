/**
API for Iteration Service
Created By Damian Villanueva P
**/
var request = require('superagent');
require('superagent-proxy')(request);

var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json');
var proxy = config.proxy;
var tokenEndPoint = endPoints;
var tokenHeader = config.tokenHeader;

var projectIteration = function(projectID, token, callback) {
    var iterationEndPoint = endPoints.iteration.iterationtokenEndPoint.replace('{project_id}', projectID);

    request

        .get(iterationEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .end(function(err, res) {
            console.log(iterationEndPoint);
            console.log('The project has been Displayed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res);
        });
};

exports.projectIteration = projectIteration;

var putIteration = function(projectID, itNumber, token, callback) {
    var iterationEndPoint = endPoints.iteration.iterationtokenEndPoint2.replace('{project_id}', projectID)
        .replace('{iteration_number}', itNumber);
        
    request
        .put(iterationEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .type('application/json')
        .send({
            "length": 5,
            "team_strength": 0.7
        })
        .accept('json')
        .end(function(err, res) {
            console.log(iterationEndPoint);
            console.log('The project has been Displayed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res.status);
        });
};

exports.putIteration = putIteration;