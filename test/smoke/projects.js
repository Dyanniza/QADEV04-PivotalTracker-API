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


        it(' GET /projects', function(done) {
            project
                .getProject(id, function(res) {
                    console.log(res.body);
                    expect(res.status).to.equal(200);
                    id = -1;
                    done();

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

    describe('Service Projects by ID', function() {

        it('GET /projects/{project_id}', function(done) {
            
            var prj = {
                name: chance.string()
            };
            project
                .createProject(prj, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .getProject(id, function(res) {
                            expect(res.status).to.equal(200);

                            project
                                .deleteProject(id, function(res) {
                                    expect(res.status).to.equal(204);
                                    done();
                                });
                        });
                });
        });

        it('PUT /projects/{project_id}', function(done) {
            var id = -1;
            var prj = {
                name: chance.string()
            };
            var editprj = {
                name: chance.string()
            };
            project
                .createProject(prj, function(res) {
                    expect(res.status).to.equal(200);
                    id = res.body.id;

                    project
                        .editProject(editprj, id, function(res) {
                            expect(res.status).to.equal(200);

                            project
                                .deleteProject(id, function(res) {
                                    expect(res.status).to.equal(204);
                                    done();
                                });

                        });
                });
        });

        it('DELETE /projects/{project_id}', function(done) {
            var id = -1;
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
                            done();
                        });
                });
        });

    });


});