/**
API for ProjectMembership Service
Created By Damian Villanueva P
**/
var request = require('superagent');
require('superagent-proxy')(request);
var config = require('..//config.json');
var endPoints = require('..//endPoints.json');
var proxy = config.proxy;
var tokenEndPoint = endPoints;
var tokenHeader = config.tokenHeader;

var post = function(projectID, token, callback) {
    var prjMSEndPoint = endPoints.projectMembership.prjMembership.replace('{project_id}', projectID);
    request
        .post(prjMSEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .type('application/json')
        .send({
            "email": "Jhasmany.Quiroz@fundacion-jala.org",
            "role": "member"
        })
        .accept('json')
        .end(function(err, res) {
            if (err) {
                console.log('Error added Membership in the project ' + JSON.stringify(res.body));
            } else {
                console.log('The Membership has been added in the Project ' + JSON.stringify(res.body));
            } 
            callback(res);
        });
};
exports.post = post;

var get = function(projectID, token, callback) {
    var prjMSEndPoint = endPoints.projectMembership.prjMembership.replace('{project_id}', projectID);
    request
        .get(prjMSEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .end(function(err, res) {
            console.log('STATUS', res.status);
            if (err) {
                console.log('Error GET Membership to project ' + JSON.stringify(res.body));
            } else {
                console.log('GET Membership Project ' + JSON.stringify(res.body));
            }
            callback(res);
        });
};
exports.get = get;
//revisar
var getMember = function(projectID, memberID, token, callback) {
    var prjMSEndPoint = endPoints.projectMembership.operationPrjMembership.replace('{project_id}', projectID)
                                                                 .replace('{membership_id}',memberID);
    request
        .get(prjMSEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .end(function(err, res) {
            if (err) {
                console.log('Error GET Membership ' + JSON.stringify(res.body));
            } else {
                console.log('GET Membership ' + JSON.stringify(res.body));
            }
            callback(res);
        });
};
exports.getMember = getMember;

var del = function(projectID, memberID, token, callback) {
    var prjMSEndPoint = endPoints.projectMembership.operationPrjMembership.replace('{project_id}', projectID)
                                                                 .replace('{membership_id}',memberID);
    console.log(memberID);
    console.log(token);
    console.log(projectID);
    console.log(prjMSEndPoint);
    request
        .del(prjMSEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .type('application/json')
        .end(function(err, res) {
            if (err) {
                console.log('Error Removed Member ' + JSON.stringify(res.body));
            } else {
                console.log('The Member has been Removed ' + JSON.stringify(res.body));
            }
            callback(res);
        });
};
exports.del = del;


var put = function(projectID,memberID,token, callback){
    var prjMSEndPoint = endPoints.projectMembership.operationPrjMembership.replace('{project_id}', projectID)
                                                                 .replace('{membership_id}',memberID);

    request
        .put(prjMSEndPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .type('application/json')
        .send({"role":"viewer"})
        .end(function(err, res) {
            if (err) {
                console.log('Error updated Member ' + JSON.stringify(res.body));
            } else {
                console.log('The Member has been updated ' + JSON.stringify(res.body));
            }
            callback(res);
        });

};
exports.put=put;