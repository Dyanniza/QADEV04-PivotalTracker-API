/*
@author Cecilia Chalar
@class LABELs for Smoke Testing Cases the Services .
 */
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();

var endPoints = require('../../resources/endPoints.json');
var config = require('../../resources/config.json');
var httpMethod = require('../../lib/generalLib.js');
var tokenAPI = require('../../lib/tokenAPI');

var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;

var userCredentials = config.userCredential;
var status = config.status;
var token = null;
var endPoint = null;
var projectId = null;
var storyID = null;
var labelId = null;

describe('Smoke test for Labels', function() {
    this.timeout(config.timeout);

    before('Get Token', function(done) {
        tokenAPI
            .getToken(userCredentials, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();
            });
    });

    beforeEach('Create a Project', function(done) {
        endPoint = projectsEndPoint;
        var projectName = {
            name: chance.string()
        };

        httpMethod
            .post(projectName, token, endPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                projectId = res.body.id;
                done();
            });
    });

    afterEach('Deleting Project', function(done) {
        var endPoint = projectByIdEndPoint.replace('{project_id}', projectId)
        httpMethod
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                projectId = null;
                done();
            });
    });


    describe('Labels Test Suite for endpoind: /projects/{project_id}/labels', function() {

        endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);

        it('GET /projects/{project_id}/labels', function(done) {
            httpMethod
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                });
        });

        it('POST /projects/{project_id}/labels', function(done) {
            endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);            
            var content = {
                name: chance.string({pool: 'label'})
            };
            httpMethod
                .post(content, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    label_id = res.body.id;
                    done();
                });
        });

    });


    describe('Labels Test suite for endPoint: /projects/{project_id}/labels/{label_id}', function() {
        endPoint = labelByIdProjectIdEndPoint.replace('{project_id}', projectId).replace('{label_id}', labelId);

        it('GET /projects/{project_id}/labels/{label_id}', function(done) {           
            httpMethod

                .get(token, endPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                done();
            });
        });

        it('PUT /projects/{project_id}/labels/{label_id}', function(done) {           
            var content = {
                name: chance.string({pool: 'label'})
            };
            
            httpMethod
                .put(content, token, endPoint, function(res) {
                expect(res.status).to.equal(404);
                done();
            });
        });

        it('DELETE /projects/{project_id}/labels/{label_id}', function(done) {
            httpMethod
                .del(token, endPoint, function(res) {
                expect(res.status).to.equal(404);
                done();
            });
        });
    });

    describe('Labels Test Suite for endPoint: /projects/{project_id}/stories/{story_id}/labels', function() {

        beforeEach('Create precondition, at least story in the project', function(done) {
            var eP = storiesEndPoint.replace('{project_id}', projectId);
            var content = {
                name: 'Story to test a label'
            };

            httpMethod
                .post(content, token, eP, function(res) {
                    expect(res.status).to.equal(status.ok);
                    storyID = res.body.id;
                    done();
                });
        });

        it('GET /projects/{project_id}/stories/{story_id}/labels', function(done) {
            var endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);
            httpMethod
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                });

        });

        it('POST /projects/{project_id}/stories/{story_id}/labels', function(done) {
            var endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);         
            var content = {
                name: chance.string({pool: 'label'})
            };

            httpMethod
                .post(content, token, endPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                done();
            });
        });
    });


    describe('test suite endPoint: /projects/{project_id}/stories/{story_id}/labels/{label_id}', function() {

        it('DELETE /projects/{project_id}/stories/{story_id}/labels/{label_id}', function(done) {
            var endPoint = labelIdStoryIdProjectIdEndPoint.replace('{project_id}', projectId).replace('{story_id}', storyID).replace('{label_id}', labelId);
            httpMethod
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.notFound);
                    done();
                });
        });
    });

    describe('Labels services,endPoint: /projects/{project_id}/stories}', function() {

        it('POST /projects/{project_id}/stories', function(done) {

            var endPointP = storiesEndPoint.replace('{project_id}', projectId);
            var content = {
                name: 'Story to test a label',
                labels: [chance.string({pool: 'labels'})]
            };

            httpMethod
                .post(content, token, endPointP, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                });
        });
    });
});