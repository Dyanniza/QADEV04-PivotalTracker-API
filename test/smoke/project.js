/*
@ Author Ronald Butron
@ Story Tasks Test
 */

var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();
var project = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var endPoints = require('../../resources/endPoints.json');

/**
 * End point services
 */
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;

/**
 * Variables to be used in the differents tests
 */
var userCredential = config.userCredential;
var status = config.status;
var token = null;
var id = null;


describe('Smoke Test Pivotal Tracker', function() {
    this.timeout(20000);
    before('Get Token', function (done) {
        getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();
                
            });
    });

    describe('Service Projects', function() {
       
        beforeEach('Creating Projejct...', function (done) {
            var argument = {
                name: chance.string(), initial_velocity : 5
            };
            project
                .post(argument, token, projectsEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    id = res.body.id;
                    done();
                    

                });
            
        });

        afterEach('Deleting Project..', function (done) {
        	var endPoint = projectByIdEndPoint.replace('{project_id}', id)  
            project
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.noContent);
                    id = null;
                    done();
                    
                });
            
        });

        it(' GET /projects', function(done) {
            
            project
                .get(token, projectsEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                    
                });
        });

        it('GET /projects/{project_id}', function(done) {
           var endPoint = projectByIdEndPoint.replace('{project_id}', id);
                           
            project
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();

                });
        });
    
        it('PUT /projects/{project_id}', function(done) {
        	var endPoint = projectByIdEndPoint.replace('{project_id}', id);
           var argument = {
                name: chance.string()
            };
            
            project
                .put(argument, token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();
                    
                });
        });
     
    }); 

    describe('Delete and Post methods', function() {

        it('POST /projects', function(done) {
            
            var argument = {
                name: chance.string(), initial_velocity : 5
            };
            project
                .post(argument, token, projectsEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    id = res.body.id;
                    done();
                       
                });
        });

        it('DELETE /projects/{project_id}', function(done) {
           
            endPoint = projectByIdEndPoint.replace('{project_id}', id);
            project
            	.del(token, endPoint, function(res) {
                	expect(res.status).to.equal(status.noContent);
                	id = null;
                	done();
            	});
	    });

    }); 
});
