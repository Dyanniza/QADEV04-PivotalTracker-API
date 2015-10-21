// Service Story tasks
/*Author Ronald Butron Salvatierra*/
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');
var chance = new Chance();
var project = require('../../lib/projectsAPI');
var task = require('../../lib/taskAPI');
var postStories = require('../../lib/postStoriesAPI');
var prjId = -1;
var storyId = -1;
var taskId = -1;
var taskEdited ={
                description : chance.sentence({words : 5})
            };

    //this.timeout(20000);

    /*describe('Suit of Story Task', function () {

        it('POST /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        //prj sto delprj
               
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
                                        prjId = -1;
                                        storyId = -1;
                                        done();
                                    });
                            });
                    });
            });
        });
        
    });*/

    describe('Suit Stories Tasks ', function () {
        this.timeout(20000);
        
        beforeEach('Creating Pre Condition.....', function (done) {
            var prj = {
            name: chance.string()
            };
            var story = {
                name: chance.string()
            };
            var taskName = {
                description: chance.sentence({words: 5})
            };
            taskEdited ={
                description : chance.sentence({words : 5})
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
                                    done();
                                 
                                    
                                    
                                });
                        });
                });
        });

        afterEach('Deleting project....', function (done) {

            project
                .deleteProject(prjId, function(res) {
                    expect(res.status).to.equal(204);
                    console.log('++++++Project Deleted+++++++', res.status);
                    prjId = -1;
                    storyId = -1;
                    taskId = -1;
                    done();
                    
                });
        });

        it('GET /projects/{project_id}/stories/{story_id}/tasks', function() {
            
            task
                .getTask(prjId, storyId, taskId, function(res) {
                    expect(res.status).to.equal(200);
                });
        });

    

        it('GET /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function() {
            //prj sto createtask delprj       
            task
                .getTask(prjId, storyId, taskId, function(res) {
                    expect(res.status).to.equal(200);
                });
        });

        it.only('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
            //prj sto createtask delprj

            task
                .editTask(taskEdited, prjId, storyId, taskId, function(res) {
                    console.log(res.status);
                    expect(res.status).to.equal(200);
                    done();
                    


                });
        });

        it('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function() {
            //prj sto createtask delprj       
            task
                .deleteTask(prjId, storyId, taskId, function(res) {
                    expect(res.status).to.equal(204);
                    console.log(res.status);

                });
        });
    });
