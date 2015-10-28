/*
@author Jhasmany Quiroz
@Class ACTIVITY for Test Cases the Services of 'Stories'.
 */
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var activities = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');
var crudConfig = require('../../resources/crudConfig');

/**
 * End point services
 */
var activitysEndPoint = endPoints.activity;
var epics = endPoints.activity.epicsEndPoint;
var projectsEndPoint = endPoints.projects;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var project_id = null;
var argument = crudConfig.stories.post;
var userCredential = config.userCredential;
var status = config.status;
var chance = new Chance();
var story_id = null;
var newProject = {
    name: chance.string()
};

describe('CRUD Test for Actvity Service Pivotal Tracker', function() {
    this.timeout(config.timeout);
    before('Getting Token.....', function(done) {
        getToken
            .getToken(userCredential, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                projectsEndPoint = projectsEndPoint.projectsEndPoint;
                activities
                    .post(newProject, token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        newProject.project_id = res.body.id;
                        project_id = res.body.id;
                        crudConfig.activity.get.project.id = newProject.project_id;
                        crudConfig.activity.get.project.name = newProject.name;
                        projectsEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', newProject.project_id);
                        activities
                            .post(argument, token, projectsEndPoint, function(res) {
                                story_id = res.body.id;
                                expect(res.status).to.equal(status.ok);
                                done();
                            });
                    });
            });
    });

    after('DELETING THE PROJECT ...', function(done) {
        projectsEndPoint = endPoints.projects.projectByIdEndPoint;
        projectsEndPoint = projectsEndPoint.replace('{project_id}', project_id);
        activities
            .del(token, projectsEndPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                expect(res.body.status).to.be.empty;
                token = null;
                project_id = null;
                argument = null;
                done();
            });
    });

    it('GET /my/activity', function(done) {
        activitysEndPoint = activitysEndPoint.myActivitysEndPoint;
        var crudJson = crudConfig.stories.postDefault;
        activities
            .get(token, activitysEndPoint, function(res) {
                expect(res.body[0].changes[0].kind).to.equal(crudJson.kind);
                expect(res.body[0].changes[0].name).to.equal(argument.name);
                expect(res.body[0].changes[0].story_type).to.equal(crudJson.story_type);
                expect(res.body[0].changes[0].new_values.current_state).to.equal(crudJson.current_state);
                expect(res.body[0].changes[0].new_values.owner_ids.length).to.equal(crudJson.owner_ids.length);
                expect(res.body[0].changes[0].new_values.labels.length).to.equal(crudJson.labels.length);
                done();
            });
    });

    it('GET /projects/{project_id}/activity', function(done) {
        activitysEndPoint = endPoints.activity.myActivitysProject.replace('{project_id}', newProject.project_id);
        var crudJson = crudConfig.activity.get;
        activities
            .get(token, activitysEndPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                expect(res.body[0].kind).to.equal(crudJson.kind);
                expect(res.body[0].message).to.equal(crudJson.message);
                expect(res.body[0].highlight).to.equal(crudJson.highlight);
                expect(res.body[0].project.kind).to.equal(crudJson.project.kind);
                expect(res.body[0].project.id).to.equal(crudJson.project.id);
                expect(res.body[0].project.name).to.equal(crudJson.project.name);
                done();
            });
    });

    it('GET /projects/{project_id}/stories/{story_id}/activity', function(done) {
        activitysEndPoint = endPoints.activity.myActivitysStorie.replace('{project_id}', newProject.project_id);
        activitysEndPoint = activitysEndPoint.replace('{story_id}', story_id);
        var crudJson = crudConfig.activity.get;
        activities
            .get(token, activitysEndPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                expect(res.body[0].kind).to.equal(crudJson.kind);
                expect(res.body[0].message).to.equal(crudJson.message);
                expect(res.body[0].highlight).to.equal(crudJson.highlight);
                expect(res.body[0].project.kind).to.equal(crudJson.project.kind);
                expect(res.body[0].project.id).to.equal(crudJson.project.id);
                expect(res.body[0].project.name).to.equal(crudJson.project.name);
                done();
            });
    });

    it('GET /projects/{project_id}/epics/{epic_id}/activity', function(done) {
        var newEpic = {
            name: chance.string()
        };
        epicsEndPoint = epics.replace('{project_id}', project_id);
        activities
            .post(newEpic, token, epicsEndPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                newEpic.epic_id = res.body.id;
                var crudJson = crudConfig.activity.getEpic;
                activitysEndPoint = endPoints.activity.myActivitysEpic.replace('{project_id}', newProject.project_id);
                activitysEndPoint = activitysEndPoint.replace('{epic_id}', newEpic.epic_id);

                activities
                    .get(token, activitysEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        expect(res.body[0].kind).to.equal(crudJson.kind);
                        expect(res.body[0].message).to.equal(crudJson.message);
                        expect(res.body[0].highlight).to.equal(crudJson.highlight);
                        done();
                    });
            });
    });
});