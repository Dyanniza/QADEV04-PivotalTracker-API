/*
@ Author Ronald Butron
@ Projects Tests
 */
var expect = require('chai').expect;
var request = require('superagent');
var Chance = require('chance');
require('superagent-proxy')(request);
var chance = new Chance();
var project = require('../../lib/projectsAPI');
var getToken = require('../../lib/tokenAPI');
var config = require('..\\..\\config.json');
var userCredential = config.userCredential;
var token = null;
var id = -1;


describe('Smoke Test Pivotal Tracker', function() {
    this.timeout(20000);
    before('Get Token', function (done) {
        getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(200);
                token = res.body.api_token;
                done();
                
            });
    });

    describe('Service Projects', function() {
       
        beforeEach('Creating Projejct...', function (done) {
            var prj1 = {
                name: chance.string()
            };
            project
                .createProject(prj1, token, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;
                    done();
                    

                });
            
        });

        afterEach('Deleting Project....', function (done) {
            
            project
                .deleteProject(id, token, function(res) {
                    expect(res.status).to.equal(204);
                    id = -1;
                    done();
                    
                });
            
        });

        it(' GET /projects', function(done) {
            
            project
                .getProject(id, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                    
                });
        });

        it('GET /projects/{project_id}', function(done) {
           
                           
            project
                .getProject(id, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();

                });
        });
    



        it('PUT /projects/{project_id}', function(done) {

           
            var editprj = {
                name: chance.string()
            };
            
            project
                .editProject(editprj, id, token, function(res) {
                    expect(res.status).to.equal(200);
                    done();
                    
                });
        });

        
    });

    describe('Delete and Post methods', function() {

        it('DELETE /projects/{project_id}', function(done) {
            
            var prj = {
                name: chance.string()
            };
            project
                .createProject(prj, token, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .deleteProject(id, token, function(res) {
                            expect(res.status).to.equal(204);
                            id = -1;
                            done();
                        });
                });
        });

        it('POST /projects', function(done) {
           
            var prj = {
                name: chance.string()
            };
            project
                .createProject(prj, token, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .deleteProject(id, token, function(res) {
                            expect(res.status).to.equal(204);
                            id = -1;
                            done();
                        });

                });
        });

    });


});