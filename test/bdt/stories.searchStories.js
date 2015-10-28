/*
@author Jhasmany Quiroz
@Class stories.finishStories for Test Cases the Services of 'Stories'.

Story: Search all the user stories of a project that belong to the same owner.  
    Given that I have the 'API Testing' project.
    When I create two user stories,
        Then each user story belong to the same project,
        And it's assigned to the same owner.
    When I search the user stories of a project with the same owner.
    Then the search it returns two user stories with the same owner.
    ****
    When I search the user stories of a project
      And of the same owner.
    Then the search it returns two user stories with the same owner.
*/
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var stories = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');
var crudConfig = require('../../resources/crudConfig');
var scenario = require('../../resources/scenario.json');

/**
 * End point services
 */
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var storiesEndPoint = endPoints.stories.storiesEndPoint;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var projectId = null;
var storyId = null;
var endPoint = null;
var project = crudConfig.project.post;
var story = crudConfig.stories.post;
var status = config.status;
var userCredential = config.userCredential;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var id = null;
var argument = crudConfig.stories.post;
var userCredential = config.userCredential;
var status = config.status;
var chance = new Chance();

describe('SCENARIO 1: Search all the user stories of a project that belong to the same owner.', function() {
    this.timeout(config.timeout);
    before(function(done) {
        getToken
            .getToken(userCredential, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                endPoint = projectsEndPoint;
                stories
                    .post(project, token, endPoint, function(res) {
                        projectId = res.body.id;
                        expect(res.status).to.equal(status.ok);
                        done();
                    });
            });
    });

    after(function(done) {
        endPoint = projectByIdEndPoint.replace('{project_id}', projectId);
        stories
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });
    });
    context('Given that I have the \'API Testing\' project.', function() {
        describe('When I create two user stories,', function() {
            var idsStory = [];
            var ownerId = {
                id: -1
            };
            before(function(done) {
                var meEndPoint = endPoints.me.meEndPoint;
                stories
                    .get(token, meEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        ownerId.id = res.body.id;
                        done();
                    });
            });

            it('Then each user story belong to the same project,', function(done) {
                var newStory = {
                    name: chance.string()
                };
                endPoint = storiesEndPoint.replace('{project_id}', projectId);
                stories
                    .post(newStory, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        idsStory.push(res.body.id);
                        newStory.name = chance.string();
                        stories
                            .post(newStory, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                idsStory.push(res.body.id);
                                done();
                            });
                    });
            });

            it('And it\'s assigned to the same owner.', function(done) {
                endPoint = endPoints.story.storyOwnersEndPoint
                    .replace('{project_id}', projectId)
                    .replace('{story_id}', idsStory[0]);
                stories
                    .post(ownerId, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        endPoint = endPoints.story.storyOwnersEndPoint
                            .replace('{project_id}', projectId)
                            .replace('{story_id}', idsStory[1]);
                        stories
                            .post(ownerId, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                done();
                            });
                    });
            });
        });

        describe('When I search the user stories of a project with the same owner.', function() {
            var search = scenario.scenarioN.owner;
            it('Then the search it returns two user stories with the same owner.', function(done) {
                endPoint = endPoints.search.searchEndPoint.replace('{project_id}', projectId) + search;
                stories
                    .get(token, endPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        stories
                            .get(token, endPoint, function(res) {
                                expect(res.status).to.equal(config.status.ok);
                                stories
                                    .get(token, endPoint, function(res) {
                                        expect(res.status).to.equal(config.status.ok);
                                        expect(res.body.stories.stories).to.exist;
                                        done();
                                    });
                            });
                    });
            });
        });
    });
});