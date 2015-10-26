/*
@ Author Ronald Butron
@ Story Tasks Test
 */


var expect = require('chai').expect;
var project = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var configLog = require('../../resources/crudConfig.json');
var endPoints = require('../../resources/endPoints.json');



 /**
 * End point services
 */

var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var id = null;
var argument = configLog.project.post;
var userCredential = config.userCredential;
var status = config.status;

describe('CRUD Test for Projects Service Pivotal Tracker', function() {
    this.timeout(20000);
    before('Getting Token.....', function (done) {
        getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();
                
            });
    });

    describe('Create Read and Delete', function() {

        it('POST /projects', function(done) {
            
            
            project
                .post(argument, token, projectsEndPoint, function(res) {
                                   
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

        it(' GET /projects', function(done) {
            var kind = configLog.project.type;
            project
                .get(token, projectsEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body[0].kind).to.equal(kind);
                    done();
                    
                });
        });

        it('DELETE /projects/{project_id}', function(done) {
           
            endPoint = projectByIdEndPoint.replace('{project_id}', id);
            project
            	.del(token, endPoint, function(res) {
                	expect(res.status).to.equal(status.noContent);
                	expect(res.body.status).to.be.empty;
                	id = null;
                	done();
            	});
	    });

        
    });

	 describe('Read and Edit Projects', function() {
       
        beforeEach('Creating Projejct...', function (done) {
            
            project
                .post(argument, token, projectsEndPoint, function(res) {
                    id = res.body.id;
                    done();
                });
        });

        afterEach('Deleting Project..', function (done) {
        	var endPoint = projectByIdEndPoint.replace('{project_id}', id)  
            project
                .del(token, endPoint, function(res) {
                    id = null;
                    done();
                });
        });

        

        it('GET /projects/{project_id}', function(done) {
           var endPoint = projectByIdEndPoint.replace('{project_id}', id);
                           
            project
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.name).to.equal(argument.name);
                   	expect(res.body.enable_tasks).to.be.true;
                   	expect(res.body.public).to.be.true;
                   	expect(res.body.initial_velocity).to.equal(argument.initial_velocity);
                   	expect(res.body.point_scale).to.equal(argument.point_scale);
                   	expect(res.body.week_start_day).to.equal(argument.week_start_day);
                    done();

                });
        });
    
        it('PUT /projects/{project_id}', function(done) {
           var endPoint = projectByIdEndPoint.replace('{project_id}', id);
           var arg = configLog.project.put;           
            project
                .put(arg, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.name).to.equal(arg.name);
                   	expect(res.body.enable_tasks).to.be.true;
                   	expect(res.body.public).to.be.false;
                   	expect(res.body.initial_velocity).to.equal(arg.initial_velocity);
                   	expect(res.body.point_scale).to.equal(arg.point_scale);
                   	expect(res.body.week_start_day).to.equal(arg.week_start_day);
                    done();
                    
                });
        });
     
    }); 
});