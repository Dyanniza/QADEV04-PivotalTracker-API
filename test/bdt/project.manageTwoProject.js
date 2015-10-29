/**
 * @Author Peniel Damian Villanueva Paca
 */
/*
Scenario 3: Two projects are managed for an account
Given I have a PivotalTracker account
	Then I created two Projects: “projectA” and “projectB”
	And I have an account with 2 projects
When I have a 2 empty Project in my account
	Then I add 2 members in “projectA”
	And I add 2 members in “projectB”
When I have member added in “projectA” and “projectB”
	Then 4 user stories should be created under “projectA”
	And 3 user stories should be created under “projectB”
When I have user stories created in the projects "projectA" and "projectB"
	Then the “projectA” should have 3 members
	And the “projectB” should have 3 members
	And the “projectA” should have 4 user stories
	And the “projectB” should have 3 user stories
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

describe('Scenario 3: Two projects are managed for an account', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = [];
    var iterationEndPoint = null;
    var chance = new Chance();
    var IDstories = [];
    var idMembersPA = [];
    var idMembersPB = [];

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });

    after('Delete the project', function(done) {
        var delEndPoint1 = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId[0]);
        var delEndPoint2 = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId[1]);
        servicesAPI
            .del(token.api_token, delEndPoint1, function(res) {
                expect(res.status).to.equal(status.noContent);
                servicesAPI
                    .del(token.api_token, delEndPoint2, function(res) {
                        expect(res.status).to.equal(status.noContent);
                        done();
                    });
            });
    });

    var projects = scenario.scenarioProjectManage.projects;

    context('Given I have a PivotalTracker account', function() {
        
        it.each(projects, 'Then I created two Projects: “projectA” and “projectB”', function(projects, done) {
            var prjByIdEndPoint = endPoint.projects.projectsEndPoint;
            servicesAPI
                .post(projects, token.api_token, prjByIdEndPoint, function(res) {
                    projectId.push(res.body.id);
                    expect(res.status).to.equal(status.ok);
                    done();
                });
        });

        it('And I have an account with 2 projects', function(done) {
            var meEndPoint = endPoint.me.meEndPoint;
            servicesAPI
                .get(token.api_token, meEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.projects.length).to.equal(2);
                    done();
                });
        });
    });

    describe('When I have a 2 empty Project in my account', function() {
        var membersPA = scenario.scenarioProjectManage.membersPA;
        var membersPB = scenario.scenarioProjectManage.membersPB;

        it.each(membersPA, 'Then I add 2 members in “projectA”', function(element, done) {
            var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[0]);
            servicesAPI
                .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.ok);
                    idMembersPA.push(projectMS.body.id);
                    done();
                });
        });
        it.each(membersPB, 'And I add 2 members in “projectB”', function(element, done) {
            var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[1]);
            servicesAPI
                .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
                    expect(projectMS.status).to.equal(status.ok);
                    idMembersPB.push(projectMS.body.id);
                    done();
                });
        });
    });

    describe('When I have member added in “projectA” and “projectB”', function() {
        var uStoryA = scenario.scenarioProjectManage.uStoryA;
        var uStoryB = scenario.scenarioProjectManage.uStoryB;
        it.each(uStoryA, 'Then 4 user stories should be created under “projectA”', function(element, done) {
            var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[0]);
            servicesAPI
                .post(element, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    IDstories.push(res.body.id);
                    done();
                });
        });
        it.each(uStoryB, 'And 3 user stories should be created under “projectB”', function(element, done) {
            var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[1]);
            servicesAPI
                .post(element, token.api_token, storyEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    IDstories.push(res.body.id);
                    done();
                });
        });
    });

    describe('When I have user stories created in the projects "projectA" and "projectB"', function() {
        it('Then the “projectA” should have 3 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[0]);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
        it('And the “projectB” should have 3 members', function(done) {
            var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[1]);
            servicesAPI
                .get(token.api_token, endPointMember, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
        it('And the “projectA” should have 4 user stories', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[0]);
            servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(4);
                    done();
                });
        });
        it('And the “projectB” should have 3 user stories', function(done) {
            var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[1]);
            servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();
                });
        });
    });
});