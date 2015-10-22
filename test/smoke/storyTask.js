/*
@ Author Ronald Butron
@ Story Tasks Test
 */


var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');
var chance = new Chance();
var project = require('../../lib/projectsAPI');
var task = require('../../lib/taskAPI');
var stories = require('../../lib/storiesApi');
var getToken = require('../../lib/tokenAPI');
var config = require('..\\..\\config.json');
var userCredential = config.userCredential;
var token = null;
var prjId = -1;
var storyId = -1;
var taskId = -1;
var taskEdited ={
                description : chance.sentence({words : 5})
            };

describe('Suit Stories Tasks', function () {
    this.timeout(20000);
    before('Get Token', function (done) {
        getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(200);
                token = res.body.api_token;
                done();
                
            });
    });    
        
    describe('Suit of Story Task', function () {
        
        it('POST /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        
               
            var prj = {
                name: chance.string()
            };
            var story = {
                name: chance.string()
            };

            var taskName = {

                description : chance.sentence({words: 5})

            };
            
            project
            .createProject(prj, token, function(res) {
                expect(res.status).to.equal(200);
                prjId = res.body.id;

                stories
                    .postStories(prjId, token, function(res) {
                        storyId = res.id;
                                                
                        task
                            .createTask(taskName, prjId, storyId, token, function(res) {
                                expect(res.status).to.equal(200);

                                project
                                    .deleteProject(prjId, token, function(res) {
                                        expect(res.status).to.equal(204);
                                        prjId = -1;
                                        storyId = -1;
                                        done();
                                    });
                            });
                    });
            });
        });
        
    });

    describe('Suit Stories Tasks ', function () {
        
        
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
                .createProject(prj, token, function(res1) {
                    expect(res1.status).to.equal(200);
                    prjId = res1.body.id;

                    stories
                        .postStories(prjId, token, function(res2) {
                            storyId = res2.id;
                       
                            task
                                .createTask(taskName, prjId, storyId, token, function(res3) {
                                    expect(res3.status).to.equal(200);
                                    taskId=res3.body.id;
                                    done();
                                 
                                    
                                    
                                });
                        });
                });
        });

        afterEach('Deleting project....', function (done) {

            project
                .deleteProject(prjId, token, function(res) {
                    expect(res.status).to.equal(204);
                    prjId = -1;
                    storyId = -1;
                    taskId = -1;
                    done();
                    
                });
        });

        it('GET /projects/{project_id}/stories/{story_id}/tasks', function(done) {
            
            task
                .getTask(prjId, storyId, taskId, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

    

        it('GET /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
                   
            task
                .getTask(prjId, storyId, taskId, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
            

            task
                .editTask(taskEdited, prjId, storyId, taskId, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                    


                });
        });

        it('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
                 
            task
                .deleteTask(prjId, storyId, taskId, token, function(res) {
                    expect(res.status).to.equal(204);
                    done();

                });
        });
    });

});
