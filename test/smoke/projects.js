//PivotalSmoke.js
/*Author Ronald Butron Salvatierra*/
var expect = require('chai').expect;
var request = require('superagent');
var Chance = require('chance');
require('superagent-proxy')(request);
var chance = new Chance();
var project = require('../../lib/projectsAPI');

var id = -1;


describe('Smoke Test Pivotal Tracker', function() {
    this.timeout(100000);

    describe('Service Projects', function() {
       
        beforeEach('Creating Projejct...', function (done) {
            console.log('First--------');
            var prj1 = {
                name: chance.string()
            };
            project
                .createProject(prj1, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;
                    done();
                    

                });
            
        });

        afterEach('Deleting Project....', function (done) {
            console.log('Last--------');
            project
                .deleteProject(id, function(res) {
                    expect(res.status).to.equal(204);
                    id = -1;
                    done();
                    
                });
            
        });

        it(' GET /projects', function() {
            
            project
                .getProject(id, function(res) {
                    expect(res.status).to.equal(200);
                    
                });
        });

        it('GET /projects/{project_id}', function() {
           
                           
            project
                .getProject(id, function(res) {
                    expect(res.status).to.equal(200);

                });
        });
    

        it.only('PUT /projects/{project_id}', function(done) {
           
            var editprj = {
                name: chance.string()
            };
            
            project
                .editProject(editprj, id, function(res) {
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
                .createProject(prj, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .deleteProject(id, function(res) {
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
                .createProject(prj, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .deleteProject(id, function(res) {
                            expect(res.status).to.equal(204);
                            id = -1;
                            done();
                        });

                });
        });

    });


});