/*
@ Author Ronald Butron
@ Story Tasks Test
 */
/*
Story: The user story deliviered that is in the current dashboad is rejected. 
Given that I have a project 'Pivotal Tracker' 
And aditional member is created in the project
And a story are already in the Current dashboard
And 2 tasks of 3 are completed
When story is finished  
	Then the user story is delivered
	And the user story is rejected for not finishing the task.
	

 */
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var crudConfig = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');
var scenario = require('../../resources/scenario.json');


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
var prj = crudConfig.project.post;
var story = crudConfig.stories;
var taskName = crudConfig.task;
var status = config.status;
var userCredential = config.userCredential;


describe('The user story is restarted', function() {

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

    context('Given that I have a project "Pivotal Tracker"', function() {


        it('And aditional member is created in the project', function(done) {
            endPoint = endPoints.projectMembership.prjMembership.replace('{project_id}', prjId);
            var argument = crudConfig.projectMembership.postEmail;
            generalLib
                .post(argument, token, endPoint, function(res) {
                    expect(res.body.project_color).to.equal(argument.project_color);
                    expect(res.body.role).to.equal(argument.role);
                    done();
                });
        });

        it('And a story are already in the Current dashboard', function(done) {
            var argument = story.post1;
            endPoint = storiesEndPoint.replace('{project_id}', prjId);

            generalLib
                .post(argument, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.name).to.equal(argument.name);
                    expect(res.body.estimate).to.equal(argument.estimate);
                    expect(res.body.current_state).to.equal(argument.current_state);
                    expect(res.body.project_id).to.equal(prjId);
                    storyId = res.body.id;
                    done();
                });
        });

        it('And 2 tasks of 3 are completed', function(done) {
            var task1 = scenario.scenario01.completedTask.task01;
            var task2 = scenario.scenario01.completedTask.task02;
            var task3 = scenario.scenario01.task03;
            endPoint = storiesTasksEndPoint.replace('{project_id}', prjId)
                                           .replace('{story_id}', storyId);

            generalLib
                .post(task1, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.description).to.equal(task1.description);
                    expect(res.body.complete).to.be.true;

                    generalLib
                        .post(task2, token, endPoint, function(res) {
                            expect(res.status).to.equal(status.ok);
                            expect(res.body.description).to.equal(task2.description);
                            expect(res.body.complete).to.be.true;

                            generalLib
                                .post(task3, token, endPoint, function(res) {
                                    expect(res.status).to.equal(status.ok);
                                    expect(res.body.description).to.equal(task3.description);
                                    expect(res.body.complete).to.be.false;
                                    done();
                                });
                        });
                });

        });


        describe('When story is finished ', function() {

            before(function(done) {
                argument = story.state.finished;
                endPoint = storiesByIdEndPoint.replace('{project_id}', prjId)
                    						  .replace('{story_id}', storyId);
                generalLib
                    .put(argument, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId);
                        expect(res.body.current_state).to.equal(argument.current_state);
                        done();

                    });
            });


            it('Then the user story is delivered', function(done) {
                argument = story.state.delivered;
                generalLib
                    .put(argument, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId);
                        expect(res.body.current_state).to.equal(argument.current_state);
                        done();

                    });


            });

            it('And the user story is rejected for not finish the task.', function(done) {
                argument = story.state.rejected;
                generalLib
                    .put(argument, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(storyId);
                        expect(res.body.current_state).to.equal(argument.current_state);
                        done();

                    });

            });


        });

    });

});