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
	Then the user stories are Finished
	And the user stories are Delivered
	And The user stories are accepted

	
 */
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var configLog = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');
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
var storyId = [];
var taskId = [];
var endPoint = null;
var prj = configLog.project.post;
var story = configLog.stories;
var taskName = configLog.task;
var kind = configLog.task.type;
var status = config.status;
var userCredential = config.userCredential;
var taskPost = [{task: taskName.post}, {task: taskName.post1}];
var stateStory = [{state: story.state.finished}, {state: story.state.finished} ];
var i = 0;
var z = 0;
var x = 0;
var j = 0;



describe('The user story is accepted', function() {

    this.timeout(config.timeout);

    before('Get tokens and create "Pivotal Tracker" project', function(done) {

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

    after('Delete the project', function(done) {

        endPoint = projectByIdEndPoint.replace('{project_id}', prjId);
        generalLib
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });

    });

    context('Given I have a project "Pivotal Tracker"', function() {

        var storiesPost = [{story: story.post1}, {story: story.post2}];
        it.each(storiesPost, 'And two stories are already in the Current dashboard', function(element, done) {

            endPoint = storiesEndPoint.replace('{project_id}', prjId);
            generalLib
                .post(element.story, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.name).to.equal(element.story.name);
                    expect(res.body.estimate).to.equal(element.story.estimate);
                    expect(res.body.current_state).to.equal(element.story.current_state);
                    storyId.push(res.body.id);
                    done();
                });

        });

        

        it.each(taskPost, 'And the two stories have a unfinished task', function(element, done) {

            endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                						   .replace('{story_id}', storyId[i]);
            generalLib
                .post(element.task, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.complete).to.be.false;
                    taskId.push(res.body.id);
                    i++;
                    done();
                });
        });



        describe('When I complete the missing tasks', function() {

            before(function(done) {

                endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
                    							   .replace('{story_id}', storyId[0])
                    							   .replace('{task_id}', taskId[0]);


                generalLib
                    .put(taskName.completed, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.complete).to.be.true;
                        endPoint = storiesTasksByIdEndPoint.replace('{project_id}', prjId)
                            .replace('{story_id}', storyId[1])
                            .replace('{task_id}', taskId[1]);
                        generalLib
                            .put(taskName.completed, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                expect(res.body.complete).to.be.true;
                                done();

                            });
                    });

            });
            
            
            it.each(stateStory, 'Then the user stories are Finished', function(element, done) {

                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId[j]);

                generalLib
                    .put(element.state, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId[j]);
                        expect(res.body.current_state).to.equal(element.state.current_state);
                        j++;
                        done();
                    });
            });

            stateStory = [{state: story.state.delivered}, {state: story.state.delivered} ];

            it.each(stateStory, 'And the user stories are Delivered', function(element, done) {

                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId[z]);

                generalLib
                    .put(element.state, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId[z]);
                        expect(res.body.current_state).to.equal(element.state.current_state);
                        z++;
                        done();
                        
                    });
            });

           
            stateStory = [{state: story.state.accepted}, {state: story.state.accepted} ];
            it.each(stateStory, 'And The user stories are accepted', function(element, done) {
                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId[x]);
                generalLib
                    .put(element.state, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId[x]);
                        expect(res.body.current_state).to.equal(element.state.current_state);
                        x++;
                        done();
                    });
            });

        });

        
    });

});