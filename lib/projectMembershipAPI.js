/**
API for ProjectMembership Service
Created By Damian Villanueva P
**/
var request = require('superagent');
require('superagent-proxy')(request);
var config = require('..//config.json');
var endPoints = require('..//endPoints.json');
var proxy = config.proxy;
var tokenEndPoint = 'https://www.pivotaltracker.com/services/v5/projects/';
var tokenHeader = 'X-TrackerToken';
var post = function(projectID, service, token, callback) {
    request
        .post(tokenEndPoint + projectID + '/' + service)
        .proxy(proxy)
        .set('X-TrackerToken', token)
        .type('application/json')
        .send({
            "email": "Jhasmany.Quiroz@fundacion-jala.org",
            "role": "member"
        })
        .accept('json')
        .end(function(err, res) {
            console.log(tokenEndPoint + projectID + '/' + service);
            console.log('The project has been Displayed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res);
        });
};
exports.post = post;

var get = function(projectID, service, token, callback) {
    request
        .get(tokenEndPoint + projectID + '/' + service)
        .proxy(proxy)
        .set('X-TrackerToken', token)
        .end(function(err, res) {
            console.log(tokenEndPoint + projectID + '/' + service);
            console.log('The project has been Displayed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res);
        });
};

exports.get = get;
var getMember = function(projectID, service, memberID, token, callback) {
    request
        .get(tokenEndPoint + projectID + '/' + service + '/' + memberID)
        .proxy(proxy)
        .set('X-TrackerToken', token)
        .end(function(err, res) {
            console.log(tokenEndPoint + projectID + '/' + service);
            console.log('The project has been Displayed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res);
        });
};
exports.getMember = getMember;

var del = function(projectID, service, memberID, token, callback) {
    request
        .del(tokenEndPoint + projectID + '/' + service + '/' + memberID)
        .proxy(proxy)
        .set('X-TrackerToken', token)
        .type('application/json')
        .end(function(err, res) {
            console.log(tokenEndPoint + projectID + '/' + service + '/' + memberID);
            console.log('The member has been Removed' + JSON.stringify(res.body));
            console.log('STATUS', res.status);
            callback(res);
        });
};
exports.del = del;