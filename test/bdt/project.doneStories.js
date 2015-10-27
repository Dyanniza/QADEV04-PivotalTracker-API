/*
@ Author Ronald Butron
@ Story Tasks Test
 */

/*
Story: The user story is accepted  
Given I have a project 'Pivotal Tracker'
And two stories are already in the Current dashboard
And the two stories have a unfinished task
When I complete the missing tasks  
	Then the user story is Finished
	And the user story is Delivered
	And The user story is accepted
When The iteration finished
	Then the story pass to the done dashboard 
	
 */

var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var configLog = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');


/**
 * End point services
 */
var storiesTasksByIdEndPoint = endPoints.projects.storiesTasksByIdEndPoint;
var storiesTasksEndPoint = endPoints.projects.storiesTasksEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var storiesEndPoint = endPoints.stories.storiesEndPoint;
var storiesByIdEndPoint = endPoints.story.storyEndPoint;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var prjId = null;
var storyId1 = null;
var storyId2 = null
var taskId1 = null;
var taskId2 = null;
var endPoint = null;
var prj = configLog.project.post;
var story = configLog.stories;
var taskName = configLog.task;
var kind = configLog.task.type;
var status = config.status;
var userCredential = config.userCredential;



describe('The user story is accepted', function () {

	this.timeout(config.timeout);

	before('Get tokens and create "Pivotal Tracker" project', function (done) {

		getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                endPoint = projectsEndPoint;
                generalLib
                	.post(prj, token, endPoint, function (res) {
                		prjId = res.body.id;
                		expect(res.status).to.equal(status.ok);
                		done();
                	});
            });					
		
	});

	after('Delete the project', function (done) {

		endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
		generalLib
			.del(token, endPoint, function (res) {
				expect(res.status).to.equal(status.noContent);
				done();
			});
		
	});

	context('Given I have a project "Pivotal Tracker"', function () {

					
			it('two stories are already in the Current dashboard', function (done) {
				
				
				endPoint = storiesEndPoint.replace('{project_id}', prjId);
				
				generalLib
					.post(story.post1, token, endPoint, function (res) {
						expect(res.status).to.equal(status.ok);
						expect(res.body.name).to.equal(story.post1.name);
						expect(res.body.estimate).to.equal(story.post1.estimate);
						expect(res.body.current_state).to.equal(story.post1.current_state);
						storyId1 = res.body.id;
						generalLib
							.post(story.post2, token, endPoint, function (res) {
								expect(res.status).to.equal(status.ok);
								expect(res.body.name).to.equal(story.post2.name);
								expect(res.body.estimate).to.equal(story.post2.estimate);
								expect(res.body.current_state).to.equal(story.post2.current_state);
								storyId2 = res.body.id;
								done();
							});
					
					});

			});

			it('And the two stories have a unfinished task', function (done) {

				endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
											   .replace('{story_id}', storyId1);
				generalLib
			   		.post(taskName.post, token, endPoint, function (res) {
			   			expect(res.status).to.equal(status.ok);
			   			expect(res.body.complete).to.be.false;
						taskId1 = res.body.id;
						endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
											   		   .replace('{story_id}', storyId2);

						generalLib
			   				.post(taskName.post1, token, endPoint, function (res) {
		   						expect(res.status).to.equal(status.ok);
		   						expect(res.body.complete).to.be.false;
								taskId2 = res.body.id;
								done();
							});
			   			
			   		});
			});

					
			
		describe('When I complete the missing tasks', function () {

			before(function (done) {
				
				endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
												   .replace('{story_id}', storyId1)
												   .replace('{task_id}', taskId1);

				
				generalLib
					.put(taskName.completed, token, endPoint, function (res) {
						expect(res.status).to.equal(status.ok);
						expect(res.body.complete).to.be.true;
						endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
												   		   .replace('{story_id}', storyId2)
										   		           .replace('{task_id}', taskId2);
						generalLib
							.put(taskName.completed, token, endPoint, function (res) {
								expect(res.status).to.equal(status.ok);
								expect(res.body.complete).to.be.true;
								done();
								
							});
					});

			});
			

			it('Then the user stories are Finished', function (done) {
				
		   		endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId1);

		   		generalLib
				.put(story.state.finished, token, endPoint, function (res) {
					expect(res.status).to.equal(status.ok);
					expect(res.body.id).to.equal(storyId1);
					expect(res.body.current_state).to.equal(story.state.finished.current_state);
					endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
					   				   		  	  .replace('{story_id}', storyId2);
					generalLib
						.put(story.state.finished, token, endPoint, function (res1) {
							expect(res1.status).to.equal(status.ok);
							expect(res1.body.id).to.equal(storyId2);
							expect(res1.body.current_state).to.equal(story.state.finished.current_state);
							done();
						});
				});
							
			});

			it('And the user stories are Delivered', function (done) {
				
				endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId1);

				generalLib
				.put(story.state.delivered, token, endPoint, function (res) {
					expect(res.status).to.equal(status.ok);
					expect(res.body.id).to.equal(storyId1);
					expect(res.body.current_state).to.equal(story.state.delivered.current_state);
					endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											   	  .replace('{story_id}', storyId2);
					generalLib
						.put(story.state.delivered, token, endPoint, function (res1) {
							expect(res1.status).to.equal(status.ok);
							expect(res1.body.id).to.equal(storyId2);
							expect(res1.body.current_state).to.equal(story.state.delivered.current_state);
							done();
						});
				});
			});

			it('And The user story is accepted', function (done) {
				endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId1);	
				generalLib
				.put(story.state.accepted, token, endPoint, function (res) {
					expect(res.status).to.equal(status.ok);
					expect(res.body.id).to.equal(storyId1);
					expect(res.body.current_state).to.equal(story.state.accepted.current_state);
					endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											   	  .replace('{story_id}', storyId2);
					generalLib
						.put(story.state.accepted, token, endPoint, function (res1) {
							expect(res1.status).to.equal(status.ok);
							expect(res1.body.id).to.equal(storyId2);
							expect(res1.body.current_state).to.equal(story.state.accepted.current_state);
							done();
						});
				});
			});
			
		});

		describe('When The iteration finished', function () {

			it('Then the story pass to the done dashboard', function (done) {
				
				endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId1);
				generalLib
					.put(story.created, token, endPoint, function (res) {
						expect(res.status).to.equal(status.ok);
						endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											   	      .replace('{story_id}', storyId2);
					generalLib
						.put(story.created, token, endPoint, function (res1) {
							expect(res1.status).to.equal(status.ok);
							done();
						});
				});
			});
			
		});
	});
	
});