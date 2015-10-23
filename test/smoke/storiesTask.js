/*
@ Author Ronald Butron
@ Story Tasks Test
 */

var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();
var methods = require('../../lib/generalLib');
var config = require('..\\..\\config.json');
var endPoints = require('..\\..\\endPoints.json');
var getToken = require('../../lib/tokenAPI');
var userCredential = config.userCredential;
var storiesTasksByIdEndPoint = endPoints.projects.storiesTasksByIdEndPoint;
var storiesTasksEndPoint = endPoints.projects.storiesTasksEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var storiesEndPoint = endPoints.stories.storiesEndPoint;
var token = null;
var prjId = null;
var storyId = null;
var taskId = null;
var endPoint = null;

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
        
    describe('Suit of Test Post a Task', function () {
        
        it('POST /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        	var prj = { name : chance.string()};
            var story = { name: chance.string()};
            var taskName = { description : chance.sentence({words: 5})};
            
            methods
            	.post(prj, token, projectsEndPoint,  function(res) {
                	expect(res.status).to.equal(200);
                	prjId = res.body.id;
                	endPoint = storiesEndPoint.replace('{project_id}', prjId);

                	methods
                    .post(story, token, endPoint, function(res) {
                        storyId = res.body.id;
                       	endPoint = storiesTasksEndPoint.replace('{project_id}', prjId )
                       								   .replace('{story_id}', storyId);
                                                
                        methods
                            .post(taskName, token, endPoint, function(res) {
                                expect(res.status).to.equal(200);
                                endPoint = projectByIdEndPoint.replace('{project_id}', prjId);

                                methods
                                    .del(token, endPoint, function(res) {
                                        expect(res.status).to.equal(204);
                                        prjId = null;
                                        storyId = null;
                                        enPoint = null;
                                        done();
                                    });
                            });
                    });
            	});
        });
        
    });

	describe('Suit Stories Tasks ', function () {
        
        
        beforeEach('Creating Pre Conditions.....', function (done) {
           var prj = { name : chance.string()};
           var story = { name: chance.string()};
           var taskName = { description : chance.sentence({words: 5})};
           
           methods
           		.post(prj, token, projectsEndPoint,  function(res) {
                	expect(res.status).to.equal(200);
                	prjId = res.body.id;
                	endPoint = storiesEndPoint.replace('{project_id}', prjId);
                	
                	methods
                    .post(story, token, endPoint, function(res) {
                        storyId = res.body.id;
                       	endPoint = storiesTasksEndPoint.replace('{project_id}', prjId )
                       								   .replace('{story_id}', storyId);
                        
                        methods
                            .post(taskName, token, endPoint, function(res) {
                                expect(res.status).to.equal(200);
                                taskId = res.body.id;
                                endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
        									   					   .replace('{story_id}', storyId)
        									   					   .replace('{task_id}', taskId);
                                
                                done();
	                        });
                    });
               	});
        });

        afterEach('Deleting project....', function (done) {
        	endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(204);
                    prjId = null;
                    storyId = null;
                    enPoint = null;
                    done();
            	});
        });

        it('GET /projects/{project_id}/stories/{story_id}/tasks', function(done) {
        	endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
        								   .replace('{story_id}', storyId);    
            methods
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

    

        it('GET /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
                   
            methods
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('PUT /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
            
        	var argument = {description : chance.sentence({words: 5})};								   
            methods
                .put(argument, token, endPoint, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('DELETE /projects/{project_id}/stories/{story_id}/tasks/{task_id}', function(done) {
                 
            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(204);
                    done();

                });
        });
    });
});