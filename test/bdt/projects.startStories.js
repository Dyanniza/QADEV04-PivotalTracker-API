/*
@ Author Ronald Butron
@ Story Tasks Test
 */
/*
Story: Start user story with assigned task order by priority
Given I have project 'Pivotal Tracker Project'
And three user stories are already in the IceBox
When I create a new user story "Change Oil to the Car"
	Then the user story allows to the 'Pivotal Tracker Project' project
When I create three task inside the user story
	Then the tasks has reference of the "Change Oil to the Car" user history 
	And order the task for priority
When The user story starts
	Then
 */

var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var configLog = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');
var scenario =  require('../../resources/scenario.json');

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
var storyId = null;
var taskId1 = null;
var taskId2 = null;
var taskId3 = null;
var endPoint = null;
var prj = configLog.project.post;
var story = configLog.stories.post;
var taskName = configLog.task.post;
var kind = configLog.task.type;
var status = config.status;
var userCredential = config.userCredential;


describe('Start user story', function () {
	this.timeout(20000);
	before(function (done) {
		
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

	after(function (done) {
		console.log('Deleting Project');
		endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
		generalLib
			.del(token, endPoint, function (res) {
				expect(res.status).to.equal(status.noContent);
				done();
			});
		
	});

	context('Given I have project Pivotal Tracker Project', function () {

		before(function () {

			it('And two user stories are already in the IceBox', function (done) {
				var storyName1 = story;
				var storyName2 = story;
				storyName1.name = scenario.storyName1;
				storyName2.name = scenario.storyName2;
				endPoint = storiesEndPoint.replace('{project_id}', prjId);

				generalLib
					.post(storyName1, token, enPoint, function (res) {
						expect(res.status).to.equal(status.ok);

						generalLib
							.post(storyName1, token, enPoint, function (res) {
								expect(res.status).to.equal(status.ok);
								done();
							});
					});
			});
			
		});

		describe('When I create a new user story "As a tester verify that Z function "', function () {

			it('Then the user story belongs to the "Pivotal Tracker" project', function (done) {
				endPoint = storiesEndPoint.replace('{project_id}', prjId);
				generalLib
					.post(story, token, endPoint, function (res) {
						expect(res.status).to.equal(status.ok);
						expect(res.body.name).to.equal(story.name);
						expect(res.body.project_id).to.equal(prjId);
						storyId = res.body.id
						done();
					});
			});

			it('And has set the effort to 1', function (done) {
				endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId);
				var update = configLog.stories.put;
				generalLib
					.put(update, token, endPoint, function (res) {
						expect(res.status).to.equal(status.ok);
						expect(res.body.estimate).to.equal(update.estimate);
						done();
					
					});
				
			});
			
		});

		describe('When I create three task inside the user story', function () {

			it('Then the tasks has reference of the "As a terster verify that Z function has been implementes" user story ', function (done) {
				var argument1 = scenario.scenario01.task01;
				var argument2 = scenario.scenario01.task02;
				var argument3 = scenario.scenario01.task03; 
				var endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
											  	   .replace('{story_id}', storyId); 
				
										  	   																	 
				generalLib
					.post(argument1, token, endPoint, function (res) {
						expect(res.body.story_id).to.equal(storyId);
						taskId1 = res.body.id;
						generalLib
							.post(argument2, token, endPoint, function (res) {
								expect(res.body.story_id).to.equal(storyId);
								taskId2 = res.body.id;
								generalLib
									.post(argument3, token, endPoint, function (res) {
										expect(res.body.story_id).to.equal(storyId);
										taskId3 = res.body.id;
										done();
									});
							});
					});
				
					
			});

			it('And order the task for priority', function (done) {
				
				var argument3 = scenario.scenario01.position1

				endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId)	
											  .replace('{task_id}', taskId3);
	
									  	   															 		
				generalLib
					.put(argument3, token, endPoint, function (res) {
						expect(res.body.id).to.equal(taskId3);
						expect(res.body.position).to.equal(argument3.position);
						endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
											  	   		   .replace('{story_id}', storyId)
											  	   		   .replace('{task_id}', taskId2);
						done();
						
					});
			});
			
		});

		describe('When The user story starts', function () {

			it('Then the user stories go to the current BackLog ', function (done) {
				endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
											  .replace('{story_id}', storyId);
				var argument = scenario.scenario01.started;
				generalLib
					.put(argument, token, endPoint, function (res) {
						expect(res.body.id).to.equal(storyId);
						expect(res.body.current_state).to.equal(argument.current_state);
						done();
						
					});
				

			});
			
		});
		
	});
	
});
