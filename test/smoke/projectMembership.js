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

describe('Project Membership Service, Smoke Testing', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
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

    it('POST/projects/{project_id}/memberships', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument = {
            email: crudConfig.projectMembership.account.email,
            role: crudConfig.projectMembership.account.role
        };
        servicesAPI
            .post(argument, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                done();
            });
    });

    it('GET/projects/{project_id}/memberships', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                done();
            });
    });
});