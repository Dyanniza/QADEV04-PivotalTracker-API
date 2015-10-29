/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
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

describe('Project Membership operations GET,PUT,DELETE, CRUD Testing', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
    var member = null;
    var chance = new Chance();

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });

    beforeEach('Creating a project base', function(done) {
        var argument = crudConfig.project.post;
        prjByIdEndPoint = endPoint.projects.projectsEndPoint;
        servicesAPI
            .post(argument, token.api_token, prjByIdEndPoint, function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(status.ok);
                expect(res.body.name).to.equal(argument.name);
                expect(res.body.enable_tasks).to.be.true;
                expect(res.body.initial_velocity).to.equal(argument.initial_velocity);
                expect(res.body.point_scale).to.equal(argument.point_scale);
                expect(res.body.week_start_day).to.equal(argument.week_start_day);
                id = res.body.id;
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                done();
            });
    });
    beforeEach('Add a MemberShip in the project', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument = crudConfig.projectMembership.account;
        servicesAPI
            .post({
                email: argument.email,
                role: argument.role,
                project_color: argument.project_color
            }, token.api_token, prjMSEndPoint, function(res) {
                expect(res.status).to.equal(status.ok);
                member = res.body;
                done();
            });
    });

    it('GET/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', member.id);
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.body.id).to.equal(member.id);
                expect(projectMS.body.person.id).to.equal(member.person.id);
                expect(projectMS.body.person.name).to.equal(member.person.name);
                expect(projectMS.body.person.email).to.equal(member.person.email);
                expect(projectMS.body.person.initial).to.equal(member.person.initial);
                expect(projectMS.body.person.username).to.equal(member.person.username);
                expect(projectMS.body.person.id).to.equal(member.person.id);
                expect(projectMS.body.role).to.equal(member.role);
                expect(projectMS.body.project_color).to.equal(member.project_color);
                expect(projectMS.body.wants_comment_notifications_or_emails).to.equal(member.wants_comment_notifications_or_emails);
                expect(projectMS.body.will_receive_mention_notifications_or_emails).to.equal(member.will_receive_mention_notifications_or_emails);
                done();
            });
    });

    it('PUT/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', member.id);
        var argument = crudConfig.projectMembership.put;
        servicesAPI
            .put(argument, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.body.id).to.equal(member.id);
                expect(projectMS.body.person.id).to.equal(member.person.id);
                expect(projectMS.body.person.name).to.equal(member.person.name);
                expect(projectMS.body.person.email).to.equal(member.person.email);
                expect(projectMS.body.person.initial).to.equal(member.person.initial);
                expect(projectMS.body.person.username).to.equal(member.person.username);
                expect(projectMS.body.person.id).to.equal(member.person.id);
                expect(projectMS.body.role).to.equal(argument.role);
                expect(projectMS.body.project_color).to.equal(argument.project_color);
                expect(projectMS.body.wants_comment_notifications_or_emails).to.equal(member.wants_comment_notifications_or_emails);
                expect(projectMS.body.will_receive_mention_notifications_or_emails).to.equal(member.will_receive_mention_notifications_or_emails);
                done();
            });
    });

    it('DELETE/projects/{project_id}/memberships/{membership_id}', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', member.id);
        servicesAPI
            .del(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.noContent);
                expect(projectMS.body).to.be.empty;
                done();
            });
    });
});