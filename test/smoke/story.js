/*
@author Jhasmany Quiroz
@Class STORY for Test Cases the Services of 'Story'.
 */
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');

var userCredential = config.userCredential;
var token = null;
var chance = new Chance();

var prj = {
    name: chance.string(),
    id: -1
};
var story = {
    name: chance.string(),
    id: -1
};
var owner = {
    name: chance.string(),
    id: chance.integer()
};
var ownerId = {
    id: -1
};

/**
 * @param  Test to Service's Story
 * @return Passing or Failing of Test Case executed.
 */
describe('STORY of Project', function() {
    this.timeout(config.timeout);

    before('GETTING THE TOKEN AND CREATED THE FILES', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                generalLib
                    .post(prj, token.api_token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        prj.id = res.body.id;

                        var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', prj.id);
                        generalLib
                            .post(story, token.api_token, storiesEndPoint, function(res) {
                                expect(res.status).to.equal(config.status.ok);
                                story.id = res.body.id;
                                done();
                            });
                    });
            });
    });

    after('DELETED THE FILES', function(done) {
        var endPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', prj.id);
        generalLib
            .del(token.api_token, endPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });

    it('GET /projects/{project_id}/stories/{story_id}', function(done) {
        var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
        generalLib
            .get(token.api_token, storyEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('PUT /projects/{project_id}/stories/{story_id}', function(done) {
        var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
        story.name = chance.string();
        generalLib
            .put(story, token.api_token, storyEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('DELETED /projects/{project_id}/stories/{story_id}', function(done) {
        var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
        generalLib
            .del(token.api_token, storyEndPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });
});

/**
 * @param  Test to Service's Story
 * @return Passing or Failing of Test Case executed.
 */
describe('STORIES OF PROJECT ABOUT OWNER', function() {
    this.timeout(config.timeout);

    before('GETTING THE TOKEN AND CREATED THE FILES', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                generalLib
                    .post(prj, token.api_token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        prj.id = res.body.id;
                        prj.account_id = res.body.account_id;

                        var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', prj.id);
                        generalLib
                            .post(story, token.api_token, storiesEndPoint, function(res) {
                                expect(res.status).to.equal(config.status.ok);
                                story.id = res.body.id;

                                var meEndPoint = endPoints.me.meEndPoint;
                                generalLib
                                    .get(token.api_token, meEndPoint, function(res) {
                                        expect(res.status).to.equal(config.status.ok);
                                        ownerId.id = res.body.id;

                                        var storyOwnersEndPoint = endPoints.story.storyOwnersEndPoint.replace('{project_id}', prj.id);
                                        storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', story.id);
                                        generalLib
                                            .post(ownerId, token.api_token, storyOwnersEndPoint, function(res) {
                                                expect(res.status).to.equal(config.status.ok);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    after('DELETED THE FILES', function(done) {
        var endPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', prj.id);
        generalLib
            .del(token.api_token, endPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });

    it('GET /projects/{project_id}/stories/{story_id}/owners', function(done) {
        var storyOwnersEndPoint = endPoints.story.storyOwnersEndPoint.replace('{project_id}', prj.id);
        storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', story.id);
        generalLib
            .get(token.api_token, storyOwnersEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('POST /projects/{project_id}/stories/{story_id}/owners', function(done) {
        var storyOwnersEndPoint = endPoints.story.storyOwnersEndPoint.replace('{project_id}', prj.id);
        storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', story.id);
        generalLib
            .post(ownerId, token.api_token, storyOwnersEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('DELETED /projects/{project_id}/stories/{story_id}/owners/{person_id}', function(done) {
        var storyOwnerIdEndPoint = endPoints.story.storyOwnerIdEndPoint.replace('{project_id}', prj.id);
        storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('{story_id}', story.id);
        storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('{person_id}', ownerId.id);
        generalLib
            .del(token.api_token, storyOwnerIdEndPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });
});

/**
 * @param  Test to Service's Story
 * @return Passing or Failing of Test Case executed.
 */
describe('STORY OF PROJECT', function() {
    this.timeout(config.timeout);

    before('GETTING THE TOKEN AND CREATED THE FILES', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                generalLib
                    .post(prj, token.api_token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(config.status.ok);
                        prj.id = res.body.id;

                        var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', prj.id);
                        generalLib
                            .post(story, token.api_token, storiesEndPoint, function(res) {
                                expect(res.status).to.equal(config.status.ok);
                                story.id = res.body.id;
                                done();
                            });
                    });
            });
    });

    after('DELETED THE FILES', function(done) {
        var endPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', prj.id);
        generalLib
            .del(token.api_token, endPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });

    it('GET /stories/{story_id}', function(done) {
        var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
        generalLib
            .get(token.api_token, storyIdEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('PUT /stories/{story_id}', function(done) {
        var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
        story.name = chance.string();
        generalLib
            .put(story, token.api_token, storyIdEndPoint, function(res) {
                expect(res.status).to.equal(config.status.ok);
                done();
            });
    });

    it('DELETED /stories/{story_id}', function(done) {
        var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
        generalLib
            .del(token.api_token, storyIdEndPoint, function(res) {
                expect(res.status).to.equal(config.status.noContent);
                done();
            });
    });
});