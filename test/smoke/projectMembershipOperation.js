/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var servicesAPI = require('../../lib/generalLib')
var endPoint = require('../../resources/endPoints.json');
var Chance = require('chance');
var crudConfig = require('../../resources/crudConfig.json');
var status = config.status;

describe('Project Membership operations GET,PUT,DELETE, Smoke Testing', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
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
            .post(prj, token.api_token, prjByIdEndPoint, function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(status.ok);
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });
    });
    beforeEach('Add a MemberShip in the project', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument=crudConfig.projectMembership.account;
        servicesAPI
            .post({
                    email:argument.email,
                    role:argument.role,
                    project_color:argument.project_color
                }, token.api_token, prjMSEndPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                memberId = res.body.id;
                done();
            });
    });

    it('GET/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', memberId);
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                done();
            });
    });
    it('PUT/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', memberId);
        var argument=crudConfig.projectMembership.account;
        servicesAPI
            .put({role:argument.role}, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                done();
            });
    });
    it('DELETE/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', memberId);
        servicesAPI
            .del(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.noContent);
                done();
            });
    });
});