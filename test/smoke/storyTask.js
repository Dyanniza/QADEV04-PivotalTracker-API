// Service Story tasks
/*Author Ronald Butron Salvatierra*/
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var postProject = require('../../lib/postProjectAPI');
var delProject = require('../../lib/deleteProjectAPI');
var putProject = require('../../lib/putProjectAPI');
var getProject = require('../../lib/getProjectAPI');
var postStories = require('../../lib/postStoriesAPI');
var postTask = require('../../lib/postTaskAPI');
var getTask = require('../../lib/getTaskAPI');
var putTask = require('../../lib/putTaskAPI');
var delTask = require('../../lib/deleteTaskAPI');


describe('Service Story Task', function() {

    this.timeout(100000);

    it('GET /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1;
        var prj = {
            name: 'Project107878500'
        };
        var story = {
            name: "As a tester verify the API is implemented"
        };
        var task = {
            description: "Verify the request 200 OK"
        };
        postProject
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;
                        console.log(storyId);

                        postTask
                            .createTask(task, prjId, storyId, function(res) {
                                expect(res.status).to.equal(200);

                                getTask
                                    .getTask(prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(200);

                                        delProject
                                            .deleteProject(prjId, function(res) {
                                                expect(res.status).to.equal(204);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    it('POST /projects/{project_id}/stories/{story_id}/tasks', function(done) {

        var prjId = -1;
        var storyId = -1;
        var prj = {
            name: 'Project95587000'
        };
        var story = {
            name: "As a tester verify the API is implemented"
        };
        var task = {
            description: "Verify the request 200 OK"
        };
        postProject
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;
                        console.log(storyId);

                        postTask
                            .createTask(task, prjId, storyId, function(res) {
                                expect(res.status).to.equal(200);

                                delProject
                                    .deleteProject(prjId, function(res) {
                                        expect(res.status).to.equal(204);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('GET /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1
        var prj = {
            name: 'Project1585234000'
        };
        var story = {
            name: "As a tester verify the API is implemented"
        };
        var task = {
            description: "Verify the request 200 OK"
        };
        postProject
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        postTask
                            .createTask(task, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                getTask
                                    .getTask(prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(200);

                                        delProject
                                            .deleteProject(prjId, function(res) {
                                                expect(res.status).to.equal(204);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    it('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1
        var prj = {
            name: 'Project847485411000'
        };
        var story = {
            name: "As a tester verify the API is implemented"
        };
        var task = {
            description: "Verify the request 200 OK"
        };
        var taskEdited = {
            description: "Verify the request 204 Delete Object"
        };
        postProject
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        postTask
                            .createTask(task, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                putTask
                                    .editTask(taskEdited, prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(200);

                                        delProject
                                            .deleteProject(prjId, function(res) {
                                                expect(res.status).to.equal(204);
                                                done();

                                            });
                                    });
                            });
                    });
            });
    });

    it.only('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1
        var prj = {
            name: 'Project87852358000'
        };
        var story = {
            name: "As a tester verify the API is implemented"
        };
        var task = {
            description: "Verify the request 200 OK"
        };

        postProject
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        postTask
                            .createTask(task, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                delTask
                                    .deleteTask(prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(204);

                                        delProject
                                            .deleteProject(prjId, function(res) {
                                                expect(res.status).to.equal(204);
                                                done();

                                            });
                                    });
                            });
                    });
            });
    });
});