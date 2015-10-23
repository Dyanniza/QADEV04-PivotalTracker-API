/**
CRUD Tests for Iteration Services
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
var crudConfig=require('..\\..\\crudConfig.json')

describe('CRUD operation over PivotalTracker, Iteration Services', function() {
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
        var argument =  crudConfig.project.post;
        prjByIdEndPoint = endPoint.projects.projectsEndPoint;
        /*var prj = {
            name: chance.string()
        };*/
        servicesAPI
            .post(argument, token.api_token, prjByIdEndPoint,function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(200);
                //expect(res.status).to.equal(200);
                   expect(res.body.name).to.equal(argument.name);
                   expect(res.body.enable_tasks).to.be.true;
                   expect(res.body.initial_velocity).to.equal(argument.initial_velocity);
                   expect(res.body.point_scale).to.equal(argument.point_scale);
                   expect(res.body.week_start_day).to.equal(argument.week_start_day);
                   id = res.body.id;
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