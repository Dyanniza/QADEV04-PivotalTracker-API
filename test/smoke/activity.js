/*
@author Jhasmany Quiroz
@Class ACTIVITY for Test Cases the Services of 'Activity'.
 */
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');

/**
 * @param  Test to Service's Stories
 * @return Passing or Failing of Test Case executed.
 */
describe('ACTIVITYS ABOUT THE PROJECT', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var project_id = null;
    var chance = new Chance();
    var story = {
        name: chance.string(),
        id: -1
    };

    before('GETTING THE TOKEN AND CREATED THE FILES', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                var newProject = {
                    name: chance.string()
                };

                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                generalLib
                    .post(newProject, token.api_token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        project_id = res.body.id;
                        done();
                    });
            });
    });

    after('DELETED THE FILES', function(done) {
        var endPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', project_id);
        generalLib
            .del(token.api_token, endPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                projectId = -1;
                storyId = -1;
                done();
            });
    });

    it('GET /my/activity', function(done) {
        var myActivitysEndPoint = endPoints.activity.myActivitysEndPoint;
        generalLib
            .get(token.api_token, myActivitysEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    //return list of the selected project activity.
    it('GET /projects/{project_id}/activity', function(done) {
        var myActivitysProject = endPoints.activity.myActivitysProject.replace('{project_id}', project_id);
        generalLib
            .get(token.api_token, myActivitysProject, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    //return list of the selected story's activity.
    it('GET /projects/{project_id}/stories/{story_id}/activity', function(done) {
        var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', project_id);
        generalLib
            .post(story, token.api_token, storiesEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                story.id = res.body.id;

                var myActivitysStorie = endPoints.activity.myActivitysStorie.replace('{project_id}', project_id);
                myActivitysStorie = myActivitysStorie.replace('{story_id}', story.id);
                generalLib
                    .get(token.api_token, myActivitysStorie, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        done();
                    });
            });
    });

    //return list of the selected epic's activity.
    it('GET /projects/{project_id}/epics/{epic_id}/activity', function(done) {
        var myActivitysEpic = endPoints.activity.myActivitysEpic.replace('{project_id}', project_id);
        myActivitysEpic = myActivitysEpic.replace('{epic_id}', chance.integer());
        generalLib
            .get(token.api_token, myActivitysEpic, function(res) {
                expect(res.status).to.equal(config.status.notFound);
                done();
            });
    });
});