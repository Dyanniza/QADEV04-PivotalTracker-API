/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('..\\..\\config.json');
var servicesAPI=require('../../lib/generalLib')
var endPoint = require('..\\..\\endPoints.json');
var Chance = require('chance');

describe('Project Membership operations GET,PUT,DELETE, Smoke Testing', function(){
    this.timeout(config.timeout);
    var userCredential=config.userCredential;
    var token = null;
    var projectId = null;
    var memberId = null;
    var chance = new Chance();

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });

    beforeEach('Creating a project base', function(done) {
        prjByIdEndPoint = endPoint.projects.projectsEndPoint;
        var prj = {
            name: chance.string()
        };    

        servicesAPI
            .post(prj, token.api_token, prjByIdEndPoint,function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(200);
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        delEndPoint= endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                expect(res.status).to.equal(204);
                done();
            });
    });
    beforeEach('Add a MemberShip in the project',function(done){
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument={
            email: "Jhasmany.Quiroz@fundacion-jala.org",
            role: "member"
        };
        servicesAPI
            .post(argument,token.api_token, prjMSEndPoint, function(res){
                expect(res.status).to.equal(200);
                memberId=res.body.id;
                done();
            });
    });
    
    it('GET/projects/{project_id}/memberships/{membership_id}',function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
                                                                 .replace('{membership_id}',memberId);
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS){
                expect(projectMS.status).to.equal(200);
                done();
            });
    });
    it('PUT/projects/{project_id}/memberships/{membership_id}',function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
                                                                 .replace('{membership_id}',memberId);
        var argument={"role":"viewer"};
        servicesAPI
            .put(argument, token.api_token, prjMSEndPoint, function(projectMS){
                expect(projectMS.status).to.equal(200);
                done();
            });
    });
    it('DELETE/projects/{project_id}/memberships/{membership_id}',function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
                                                                 .replace('{membership_id}',memberId);
        servicesAPI
            .del(token.api_token, prjMSEndPoint, function(projectMS){
                expect(projectMS.status).to.equal(204);
                done();
            });
    });
});