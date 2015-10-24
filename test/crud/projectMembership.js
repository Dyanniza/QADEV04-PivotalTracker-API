/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var servicesAPI = require('../../lib/generalLib');
var endPoint = require('../../resources/endPoints.json');
var Chance = require('chance');
var crudConfig = require('../../resources/crudConfig.json');
var status = config.status;

describe('Project Membership Service, Smoke Testing', function() {
    this.timeout(config.timeout);
    var userCredential = config.userCredential;
    var token = null;
    var projectId = null;
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

    it('POST/projects/{project_id}/memberships, with "email"', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument = crudConfig.projectMembership.postEmail;
        var accountMember = crudConfig.projectMembership.account;
        servicesAPI
            .post(argument, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.body.person.name).to.equal(accountMember.name);
                expect(projectMS.body.role).to.equal(argument.role);
                expect(projectMS.body.project_color).to.equal(argument.project_color);
                expect(projectMS.body.project_id).to.equal(projectId);
                expect(projectMS.body.person.initials).to.equal(accountMember.initials);
                expect(projectMS.body.person.username).to.equal(accountMember.username);
                expect(projectMS.body.wants_comment_notification_emails).to.equal(accountMember.wants_comment_notification_emails);
                expect(projectMS.body.will_receive_mention_notifications_or_emails).to.equal(accountMember.will_receive_mention_notifications_or_emails);
                done();
            });
    });
    it('POST/projects/{project_id}/memberships, with "person_id"', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument = crudConfig.projectMembership.postPerson_id;
        var accountMember = crudConfig.projectMembership.account;
        servicesAPI
            .post(argument, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.body.person.name).to.equal(accountMember.name);
                expect(projectMS.body.role).to.equal(argument.role);
                expect(projectMS.body.project_color).to.equal(argument.project_color);
                expect(projectMS.body.project_id).to.equal(projectId);
                expect(projectMS.body.person.initials).to.equal(accountMember.initials);
                expect(projectMS.body.person.username).to.equal(accountMember.username);
                expect(projectMS.body.wants_comment_notification_emails).to.equal(accountMember.wants_comment_notification_emails);
                expect(projectMS.body.will_receive_mention_notifications_or_emails).to.equal(accountMember.will_receive_mention_notifications_or_emails);
                done();
            });
    });

    it('GET/projects/{project_id}/memberships', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument = crudConfig.projectMembership.account;
        var accountMember = crudConfig.projectMembership.account;
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(status.ok);
                expect(projectMS.body[0].id).to.be.exist;
                expect(projectMS.body[0].person.name).to.equal(userCredential.name);
                expect(projectMS.body[0].role).to.equal(userCredential.role);
                expect(projectMS.body[0].project_id).to.equal(projectId);
                expect(projectMS.body[0].person.initials).to.equal(userCredential.initials);
                expect(projectMS.body[0].person.username).to.equal(userCredential.userAccount);
                expect(projectMS.body[0].wants_comment_notification_emails).to.equal(accountMember.wants_comment_notification_emails);
                expect(projectMS.body[0].will_receive_mention_notifications_or_emails).to.equal(accountMember.will_receive_mention_notifications_or_emails);


                done();
            });
    });
});