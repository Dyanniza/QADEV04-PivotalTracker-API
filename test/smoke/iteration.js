/**
Smoke testing for Iteration Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);

var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var iterationAPI = require('../../lib/iterationAPI');
var projectsAPI = require('../../lib/projectsAPI');
var config = require('../../config.json');

describe('Smoke Tests for PivotalTracker, Iteration Services', function() {
    this.timeout(10000);

    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;

    before('Getting the token', function(done) {
        tokenAPI
            .getTrackerToken(userCredential, function(res) {
                token = res;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });

    beforeEach('Creating a project base', function(done) {
        var prj = {
            name: 'projectTest121'
        };
        projectsAPI
            .createProject(prj, token.api_token, function(res) {
                projectId = res.body.id;
                console.log('the ID the project is:   ', projectId);
                expect(res.status).to.equal(200);
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        projectsAPI
            .deleteProject(projectId, token.api_token, function(res) {
                console.log('status delete:  ', res.status);
                expect(res.status).to.equal(204);
                done();
            });
    });

    it('GET/projects/{project_id}/iterations', function(done) {
        iterationAPI
            .projectIteration(projectId, token.api_token, function(iteration) {
                expect(iteration.status).to.equal(200);
                done();
            });
    });

    it('PUT /projects/{project_id}/iteration_overrides/{iteration_number}', function(done) {
        var service = 'iteration_overrides';
        var iterationNumber = 1;
        iterationAPI
            .putIteration(projectId, iterationNumber, token.api_token, function(iteration) {
                expect(iteration).to.equal(200);
                done();
            });
    });
});