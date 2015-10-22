/**
Smoke testing for Iteration Services
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

describe('Smoke Tests for PivotalTracker, Iteration Services', function() {
    this.timeout(config.timeout);

    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
    var iterationEndPoint=null;
    var prjByIdEndPoint =null;
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
                console.log('the ID the project is:   ', projectId);
                expect(res.status).to.equal(200);
                console.log('res status:  ', res.status);
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        delEndPoint= endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                console.log('status delete:  ', res.status);
                expect(res.status).to.equal(204);
                done();
            });
    });

    it('GET/projects/{project_id}/iterations', function(done) {
        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

        servicesAPI
            .get(token.api_token, iterationEndPoint, function(iteration) {
                expect(iteration.status).to.equal(200);
                done();
            });
    });

    it('PUT /projects/{project_id}/iteration_overrides/{iteration_number}', function(done) {
        var iterationNumber = chance.integer({min: 0, max: 1});
        var argument={
            length: chance.integer({min: 1, max: 5}),
            team_strength: chance.floating({min: 0.1, max: 0.9})
        }
        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
        .replace('{iteration_number}', iterationNumber);
        servicesAPI
            .put(argument, token.api_token, iterationEndPoint, function(iteration) {
                expect(iteration.status).to.equal(200);
                done();
            });
    });
});