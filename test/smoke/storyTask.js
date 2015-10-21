// Service Story tasks
/*Author Ronald Butron Salvatierra*/
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');
var chance = new Chance();
var project = require('../../lib/projectsAPI');
var task = require('../../lib/deleteTaskAPI');
var postStories = require('../../lib/postStoriesAPI');


describe('Service Story Task', function() {

    this.timeout(10000);

    it('GET /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1;
        var prj = {
            name: chance.string()
        };
        var story = {
            name: chance.string()
        };
        var taskName = {
            description: chance.sentence({words: 5})
        };
        project
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;
                       
                        task
                            .createTask(taskName, prjId, storyId, function(res) {
                                expect(res.status).to.equal(200);
                                taskId=res.body.id;
                                console.log(taskId);

                                task
                                    .getTask(prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(200);

                                        project
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
            name: chance.string()
        };
        var story = {
            name: chance.string()
        };
        var taskName = {
            description: chance.string()
        };
        project
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;
                        
                        task
                            .createTask(taskName, prjId, storyId, function(res) {
                                expect(res.status).to.equal(200);

                                project
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
            name: chance.string()
        };
        var story = {
            name: chance.string()
        };
        var taskName = {
            description: chance.string()
        };
        project
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        task
                            .createTask(taskName, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                task
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

    it.only('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1
        var prj = {
            name: chance.string()
        };
        var story = {
            name: chance.string()
        };
        var taskName = {
            description: chance.string()
        };
        var taskEdited = {
            description: chance.string()
        };
        project
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        task
                            .createTask(taskName, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                task
                                    .editTask(taskEdited, prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(200);

                                        project
                                            .deleteProject(prjId, function(res) {
                                                expect(res.status).to.equal(204);
                                                done();

                                            });
                                    });
                            });
                    });
            });
    });

    it('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
        var prjId = -1;
        var storyId = -1;
        var taskId = -1
        var prj = {
            name: chance.string()
        };
        var story = {
            name: chance.string()
        };
        var taskName = {
            description: chance.string()
        };

        project
            .createProject(prj, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                postStories
                    .createStories(story, prjId, function(res) {
                        expect(res.status).to.equal(200);
                        storyId = res.body.id;

                        task
                            .createTask(taskName, prjId, storyId, function(res) {
                                taskId = res.body.id;
                                expect(res.status).to.equal(200);

                                task
                                    .deleteTask(prjId, storyId, taskId, function(res) {
                                        expect(res.status).to.equal(204);

                                        project
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