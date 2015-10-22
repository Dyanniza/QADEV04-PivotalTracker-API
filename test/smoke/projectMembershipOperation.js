/**
Smoke testing for ProjectMembership Services
Created By Damian Villanueva 
**/
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var projectMembershipAPI = require('../../lib/projectMembershipAPI');
var projectsAPI = require('../../lib/projectsAPI');
var config = require('../../config.json');
var iterationAPI = require('../../lib/iterationAPI');

describe('Project Membership operations GET,PUT,DELETE, Smoke Testing', function(){
    this.timeout(10000);
    var userCredential=config.userCredential;
    var token = null;
    var projectId = null;

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });

    beforeEach('Creating a project base', function(done) {
        var prj = {
            name: 'ProjectPVP'
        };
        projectsAPI
            .createProject(prj, token.api_token, function(res) {
                projectId = res.body.id;
                console.log('the ID the project is:   ', projectId);
                expect(res.status).to.equal(200);
                done();
            });
    });

    afterEach('Deleting the project created', function(done) {
        projectsAPI
            .deleteProject(projectId, token.api_token, function(res) {
                console.log('status delete:  ', res.status);
                expect(res.status).to.equal(204);
                done();
            });
    });
    beforeEach('Add a MemberShip in the project',function(done){
        var service='memberships';
        projectMembershipAPI
            .post(projectId,token.api_token,function(res){
                expect(res.status).to.equal(200);
                this.memberId=res.body.id;
                //console.log('sdsdsad', memberId);
                done();
            });
    });
    
    it('GET/projects/{project_id}/memberships/{membership_id}',function(done) {
        projectMembershipAPI
            .getMember(projectId,memberId,token.api_token,function(projectMS){
                expect(projectMS.status).to.equal(200);
                done();
            });
    });
    it('PUT/projects/{project_id}/memberships/{membership_id}',function(done) {
        projectMembershipAPI
            .put(projectId,memberId,token.api_token,function(projectMS){
                expect(projectMS.status).to.equal(200);
                done();
            });
    });
    it('DELETE/projects/{project_id}/memberships/{membership_id}',function(done) {
        projectMembershipAPI
            .del(projectId,memberId,token.api_token,function(projectMS){
                expect(projectMS.status).to.equal(204);
                done();
            });
    });
});