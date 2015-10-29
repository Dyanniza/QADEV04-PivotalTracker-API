/**
 * @Author Peniel Damian Villanueva Paca
 */
/*
Scenario 1: Correct Information about stories is displayed when the project passes the iterations

Given I have a Project whit 5 user stories
	Then 5 user stories are created under project undefined
	Then 2 project’s membership is added under project
When the project started
	Then the projects iteration should be 1
	And the project should have 3 user stories unscheduled
	And the project should have 3 members
	And 3 user stories should pass the finished state
When the project pass to the second iteration
	Then the projects iteration should be 2
	And the project should have 0 user stories unscheduled
	And the project should have 3 user stories finished
	And the project should have 2 members
	And other two user stories should be add in the project undefined
When the project pass to the second iteration
	Then the projects iteration should be 2
	And the project should have 2 user stories unscheduled
	And the project should have 3 user stories finished

-------And all actions on the project it should be displayed in the project History
*/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var servicesAPI = require('../../lib/generalLib')
var endPoint = require('../../resources/endPoints.json');
var Chance = require('chance');
var crudConfig = require('../../resources/crudConfig.json');
var status = config.status;
require('it-each')();
var scenario = require('../../resources/scenario.json');

describe('Scenario 1: Correct Information about stories is displayed when the project passes the iterations', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
    var iterationEndPoint = null;
    var chance = new Chance();
    var IDstories = [];

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });
    before('Create Project', function(done) {
        var prjByIdEndPoint = endPoint.projects.projectsEndPoint;
        var prj = {
            name: chance.string()
        };
        servicesAPI
            .post(prj, token.api_token, prjByIdEndPoint, function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(status.ok);
                done();
            });
    });

    after('Delete the project', function(done) {
        var delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });
    });
    context('Given I have a Project whit 5 user stories', function() {
        var story = scenario.scenarioIteration.story;
        var members = scenario.scenarioIteration.members;
        it.each(story, 'Then 5 user stories are created under project', ['argument'], function(element, done) {
            var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    IDstories.push(res.body.id);
                    done();
                });
        });

        it.each(members, 'hen 2 project’s membership is added under project', function(element, done) {
            var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.ok);
                    done();
                });
        });

    });
    describe('When the project started', function() {
        var current = scenario.scenarioIteration.current;

        it('Then the projects iteration should be 1', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });

        it('And the project should have 3 user stories unscheduled', function(done) {
            var storiesEndPoint = scenario.scenarioIteration.endPointUnscheduled.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });

        });
        it('And the project should have 3 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it.each(IDstories, 'And 3 user stories should pass the finished state', function(IDstories, done) {
            var storyEndPoint = endPoint.story.storyEndPoint.replace('{project_id}', projectId)
                .replace('{story_id}', IDstories);
            servicesAPI
                .put(current, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(config.status.ok);
                    done();
                });
        });
    });

    describe('When the project pass to the second iteration', function() {
        before('pass to second iteration', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
                .replace('{iteration_number}', 1);
            servicesAPI
                .put({
                    "length": 0
                }, token.api_token, iterationEndPoint, function(iteration) {
                    expect(iteration.status).to.equal(status.ok);
                    done();
                });
        });
        it('Then the projects iteration should be 2', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(2);
                    done();
                });

        });
        it('And the project should have 0 user stories unscheduled', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, storiesEndPoint + '?with_state=unscheduled', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(0);
                    done();
                });
        });
        it('And the project should have 3 user stories finished', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, storiesEndPoint + '?with_state=finished', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
        it('And the project should have 2 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        var story2 = scenario.scenarioIteration.story2;

        it.each(story2, 'And other two user stories should be add in the project', ['argument'], function(element, done) {
            var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                });
        });

    });
    describe('When the project pass to the second iteration', function() {
        before('pass to second iteration', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
                .replace('{iteration_number}', 2);
            servicesAPI
                .put({
                    "length": 0
                }, token.api_token, iterationEndPoint, function(iteration) {
                    expect(iteration.status).to.equal(status.ok);
                    done();
                });
        });
        it('Then the projects iteration should be 2', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });

        });
        it('And the project should have 2 user stories unscheduled', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, storiesEndPoint + '?with_state=unscheduled', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
        it('And the project should have 3 user stories finished', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, storiesEndPoint + '?with_state=finished', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
    });
});