/*
@ Author Ronald Butron
@ Story Tasks Test
 */
/*
Story: Start user story with assigned task order by priority
Given I have project 'Pivotal Tracker Project'
	And two user stories that are already in the IceBox
When I create a new user story "As a tester verify that Z function"
	Then the user story belongs to the "Pivotal Tracker" project
	And has set the effort to 1
When I create three task inside the user story
	Then the tasks has reference of the "As a terster verify that Z function has been implementes" user story 
	And order the task for priority
When The user story starts
	Then the user stories go to the current BackLog
	
 */
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var configLog = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');
var scenario = require('../../resources/scenario.json');
var Chance = require('chance');
var chance = new Chance();
require('it-each')();

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
var taskId = [];
var storyName1 = configLog.story.story1;
var storyName2 = configLog.story.story1;
var argument1 = scenario.scenario01.task01;
var argument2 = scenario.scenario01.task02;
var argument3 = scenario.scenario01.task03;
var priority = [{argument: argument1}, {argument: argument2}, {argument: argument3}];


describe('Start user story', function() {
    this.timeout(config.timeout);
    before(function(done) {

        getToken
            .getToken(userCredential, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                endPoint = projectsEndPoint;
                generalLib
                    .post(prj, token, endPoint, function(res) {
                        prjId = res.body.id;
                        expect(res.status).to.equal(status.ok);
                        done();
                    });
			});
    });

    after(function(done) {
        console.log('Deleting Project');
        endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
        generalLib
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });

    });

    context('Given I have project Pivotal Tracker Project', function() {

        	var storiesName =[{story1: storyName1}, {story1: storyName2}];
        	
            it.each(storiesName, 'And the two user stories are already in the IceBox', function(element, done) {
                endPoint = storiesEndPoint.replace('{project_id}', prjId);
     	        generalLib
                    .post(element.story1, token, endPoint, function(res) {
                    	expect(res.status).to.equal(status.ok);
                        done();
                    });
            });

        

        describe('When I create a new user story "As a tester verify that Z function"', function() {

            it('Then the user story belongs to the "Pivotal Tracker" project', function(done) {
                endPoint = storiesEndPoint.replace('{project_id}', prjId);
                generalLib
                    .post(story, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.name).to.equal(story.name);
                        expect(res.body.project_id).to.equal(prjId);
                        storyId = res.body.id
                        done();
                    });
            });

            it('And has set the effort to 1', function(done) {
                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId);
                var update = configLog.stories.put;
                generalLib
                    .put(update, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.estimate).to.equal(update.estimate);
                        done();

                    });

            });

        });

        describe('When I create three task inside the user story', function() {
        	 	
    	 	
			it.each(priority, 'Then the tasks has reference of the "As a terster verify that Z function has been implementes" user story ', function(element, done){
     			var endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                							   	   .replace('{story_id}', storyId);	
             	generalLib
            		.post(element.argument, token, endPoint, function(res) {
                		expect(res.body.story_id).to.equal(storyId);
                		taskId.push(res.body.id);
                		done();
                	
                });
            });


           
            it('And order the task for priority', function(done) {
                var argument3 = scenario.scenario01.position1
                taskId3 = taskId[2];

                endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
                    .replace('{story_id}', storyId)
                    .replace('{task_id}', taskId3);


                generalLib
                    .put(argument3, token, endPoint, function(res) {
                        expect(res.body.id).to.equal(taskId3);
                        expect(res.body.position).to.equal(argument3.position);
                        endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
                            .replace('{story_id}', storyId)
                            .replace('{task_id}', taskId2);
                        done();

                    });
            });

        });

        describe('When The user story starts', function() {

            it('Then the user stories go to the current BackLog ', function(done) {
                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId);
                var argument = scenario.scenario01.started;
                generalLib
                    .put(argument, token, endPoint, function(res) {
                        expect(res.body.id).to.equal(storyId);
                        expect(res.body.current_state).to.equal(argument.current_state);
                        done();

                    });
			});

        });

    });

});