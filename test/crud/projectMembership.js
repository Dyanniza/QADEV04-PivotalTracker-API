/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('..\\..\\config.json');
var servicesAPI=require('../../lib/generalLib');
var endPoint = require('..\\..\\endPoints.json');
var Chance = require('chance');
var crudConfig=require('..\\..\\crudConfig.json');
//console.log(crudConfig);

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
        var prj = {
            name: chance.string()
        };    

        servicesAPI
            .post(argument, token.api_token, prjByIdEndPoint,function(res) {
                projectId = res.body.id;
                expect(res.status).to.equal(200);
                //expect(res.status).to.equal(200);
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
        delEndPoint= endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
        servicesAPI
            .del(token.api_token, delEndPoint, function(res) {
                expect(res.status).to.equal(204);
                done();
            });
    });

    it('POST/projects/{project_id}/memberships', function(done) {
        //var prjMSEndPoint = endPoint.projectMembership.post.prjMembership.replace('{project_id}', projectId);
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        var argument=crudConfig.projectMembership.account;
        //var argument={
            //email: crudConfig.projectMembership.account.email,
            //role: crudConfig.projectMembership.account.role
            /*name: 
            initials
            project_color*/

        //};
        /*var argument=
        console.log(argument);*/

        servicesAPI
            .post({email:argument.email, role:argument.role, project_color:argument.project_color}, token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(200);
                expect(projectMS.body.person.name).to.equal(argument.name);
                expect(projectMS.body.role).to.equal(argument.role);
                expect(projectMS.body.project_id).to.equal(projectId);
                expect(projectMS.body.person.initials).to.equal(argument.initials);
                expect(projectMS.body.person.username).to.equal(argument.username);
                expect(projectMS.body.project_color).to.equal(argument.project_color);
                done();

            });
    });
/*
    it('GET/projects/{project_id}/memberships', function(done) {
        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
        servicesAPI
            .get(token.api_token, prjMSEndPoint, function(projectMS) {
                expect(projectMS.status).to.equal(200);
                done();
            });
    });*/
});