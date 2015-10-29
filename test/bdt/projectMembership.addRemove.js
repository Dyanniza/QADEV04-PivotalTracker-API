/**
 * @Author Peniel Damian Villanueva Paca
 */
/*
Scenario 2: Add and remove project members in different iterations

Given I have a Project empty
	Then 2 project memberships should add under project
	And 6 user stories should be created under project
When the project this in the first iteration
	Then the projects iteration should be 1
	And the project should have 3 members
	Then 1 project memberships should remove to project
	And the project should pass to second iteration
When the project this in the Second iteration
	Then the projects iteration should be 1
	And the project should have 2 members
	And a new project memberships should add under project
	And the project should pass to third iteration
When the project this in the third iteration
	Then the projects iteration should be 3
	And the project should have 4 members
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


describe('Scenary 2: Add and remove project members in different iterations', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
    var iterationEndPoint = null;
    var chance = new Chance();
    var IDstories = [];
    var idMembers = [];
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

    context('Given I have a Project empty', function() {
        /*var members = [{email: 'Jhasmany.Quiroz@fundacion-jala.org', role: 'member'},
        			   {email: 'jorge.avila@fundacion-jala.org', role: 'member'},
        			   ];
        var story = [{name: 'argument1'}, {name: 'argument2'}, {name: 'argument3'},{name: 'argument4'},{name: 'argument5'},{name: 'argument6'}];*/
        var members = scenario.scenarioProjectMembeship.members;
        var story = scenario.scenarioProjectMembeship.story;

        it.each(members, 'Then 2 project memberships should add under project', function(element, done) {
            var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.ok);
                    idMembers.push(projectMS.body.id);
                    done();
                });
        });

        it.each(story, 'And 6 user stories should be created under project', function(element, done) {
            var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    IDstories.push(res.body.id);
                    done();
                });
        });
    });

    describe('When the project this in the first iteration', function() {
        it('Then the projects iteration should be 1', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(1);
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

        it('Then 1 project memberships should remove to project', function(done) {
            var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
                .replace('{membership_id}', idMembers[0]);
            servicesAPI
                .del(token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.noContent);
                    expect(projectMS.body).to.be.empty;
                    done();
                });
        });
        it('And the project should pass to second iteration', function(done) {
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

    });
    describe('When the project this in the Second iteration', function() {
        var members2 = scenario.scenarioProjectMembeship.members2;
        it('Then the projects iteration should be 1', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });

        it('And the project should have 2 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });

        it.each(members2, 'And a new project memberships should add under project', function(element, done) {
            var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.ok);
                    done();
                });
        });

        it('And the project should pass to third iteration', function(done) {
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
    });

    describe('When the project this in the third iteration', function() {
        it('Then the projects iteration should be 3', function(done) {
            var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

            servicesAPI
                .get(token.api_token, iterationEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });

        it('And the project should have 4 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
    });
});