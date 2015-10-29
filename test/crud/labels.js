/*
@author Cecilia  Chalar 
@Class Labels for for CRUD testing .
*/
var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();

var endPoints = require('../../resources/endPoints.json');
var config = require('../../resources/config.json');
var httpMethod = require('../../lib/generalLib.js');
var tokenAPI = require('../../lib/tokenAPI');
var configLog = require('../../resources/crudConfig.json');

var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;

var userCredentials = config.userCredential;
var status = config.status;
var story = configLog.stories.post;
var labName = configLog.labels.label.name;
var labNamePost = configLog.labels.post.name;
var labNamePut = configLog.labels.put.name;
var type = configLog.labels.kind;

var token = null;
var endPoint = null;
var endPointStory = null;
var endPointLabel = null;
var endPointLabels = null;
var projectId = null;
var storyId = null;
var labelId = null;
var labelIdPrj = null;

describe('Suite of CRUD test for Labels', function() {
    this.timeout(config.timeout);

    before('Get Token', function(done) {
        tokenAPI
            .getToken(userCredentials, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();
            });
    });

    beforeEach('Creating Pre Conditions at least a project', function(done) {
        var projectName = {
            name: chance.string()
        };
        var storyName = {
            name: chance.string()
        };
        var contentLab = {
            name: labName
        };

        httpMethod

            .post(projectName, token, projectsEndPoint, function(res) {
            expect(res.status).to.equal(status.ok);
            projectId = res.body.id;
            endPoint = storiesEndPoint.replace('{project_id}', projectId);
            endPointLabels = labelsProjectEndPoint.replace('{project_id}', projectId);

            httpMethod
                .post(contentLab, token, endPointLabels, function(res) {
                    expect(res.status).to.equal(status.ok);
                    labelIdPrj = res.body.id;

                    httpMethod
                        .post(storyName, token, endPoint, function(res) {
                            storyId = res.body.id;
                            endPointStory = labelsByStoryIdEndPoint.replace('{project_id}', projectId)
                                .replace('{story_id}', storyId);

                            httpMethod
                                .post(contentLab, token, endPointStory, function(res) {
                                    expect(res.status).to.equal(status.ok);
                                    labelId = res.body.id;
                                    endPointLabel = labelIdStoryIdProjectIdEndPoint.replace('{project_id}', projectId)
                                        .replace('{story_id}', storyId)
                                        .replace('{label_id}', labelId);
                                    done();
                                });
                        });
                });
        });
    });

    afterEach('Deleting Project', function(done) {
        var endPoint = projectByIdEndPoint.replace('{project_id}', projectId)
        httpMethod
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(204);
                projectId = null;
                done();
            });
    });

    describe('Labels Test suite for POST methods', function() {

        it('POST /projects/{project_id}/labels', function(done) {
            endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);

            var content = {
                name: labNamePost
            };
            httpMethod
                .post(content, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.kind).to.equal(type);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labNamePost)
                    done();
                });
        });

        it('POST /projects/{project_id}/stories/{story_id}/labels', function(done) {

            var content = {
                name: labNamePost
            };
            httpMethod
                .post(content, token, endPointStory, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.kind).to.equal(type);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labNamePost)

                    done();
                });
        });

        it('POST /projects/{project_id}/stories', function(done) {
            var content = {
                name: chance.string(),
                labels: [labNamePost]
            };

            httpMethod

                .post(content, token, endPoint, function(res) {

                expect(res.status).to.equal(status.ok);
                expect(res.body.kind).to.equal('story');
                expect(res.body.labels[0].kind).to.equal(type);
                expect(res.body.labels[0].project_id).to.equal(projectId);
                expect(res.body.labels[0].name).to.equal(labNamePost)
                done();
            });
        });

    });

    describe('Labels Test Suite for GET methods', function() {

        it('GET /projects/{project_id}/labels', function(done) {
            endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);

            httpMethod
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body[0].kind).to.equal(type);
                    expect(res.body[0].project_id).to.equal(projectId);
                    expect(res.body[0].name).to.equal(labName)
                    done();
                });
        });

        it('GET /projects/{project_id}/labels/{label_id}', function(done) {
            endPoint = labelByIdProjectIdEndPoint.replace('{project_id}', projectId)
                .replace('{label_id}', labelIdPrj);
            httpMethod

                .get(token, endPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                expect(res.body.kind).to.equal(type);
                expect(res.body.id).to.equal(labelIdPrj);
                expect(res.body.project_id).to.equal(projectId);
                expect(res.body.name).to.equal(labName)
                done();
            });

        });

        it('GET /projects/{project_id}/stories/{story_id}/labels', function(done) {

            httpMethod

                .get(token, endPointStory, function(res) {
                expect(res.status).to.equal(status.ok);
                expect(res.body[0].kind).to.equal(type);
                expect(res.body[0].project_id).to.equal(projectId);
                expect(res.body[0].name).to.equal(labName)

                done();
            });
        });

    });

    describe('Labels Test suite for PUT methods', function() {

        it('PUT /projects/{project_id}/labels/{label_id}', function(done) {
            endPoint = labelByIdProjectIdEndPoint.replace('{project_id}', projectId)
                .replace('{label_id}', labelIdPrj);
            var content = {
                name: labNamePut
            };

            httpMethod
                .put(content, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.id).to.equal(labelIdPrj);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labNamePut)
                    done();
                });
        });
    });

    describe('Labels Test Suite for DELETE methods', function() {

        it('Delete /projects/{project_id}/labels/{label_id}', function(done) {
            endPoint = labelByIdProjectIdEndPoint.replace('{project_id}', projectId)
                .replace('{label_id}', labelIdPrj);

            httpMethod
                .del(token, endPointLabel, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.id).to.equal(labelIdPrj);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labName)
                    done();

                });
        });

        it('DELETE /projects/{project_id}/stories/{story_id}/labels/{label_id}', function(done) {

            httpMethod
                .del(token, endPointLabel, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.id).to.equal(labelId);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labName)
                    done();
                });
        });

    });
});