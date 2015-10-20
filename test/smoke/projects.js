//PivotalSmoke.js
/*Author Ronald Butron Salvatierra*/
var expect= require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var postProject=require('../../lib/postProjectAPI');
var delProject=require('../../lib/deleteProjectAPI');
var putProject=require('../../lib/putProjectAPI');
var getProject=require('../../lib/getProjectAPI');
var postStories=require('../../lib/postStoriesAPI');
var postTask=require('../../lib/postTaskAPI');
var getTask=require('../../lib/getTaskAPI');
var putTask=require('../../lib/putTaskAPI');
var delTask=require('../../lib/deleteTaskAPI');



describe('Smoke Test Pivotal Tracker', function() {
	this.timeout(100000);
	
	describe('Service Projects', function () {

		
		it(' GET /projects', function (done) {

			var prj=-1;
			getProject
			.getProject(prj,function (res) {
				console.log(res.body);
				expect(res.status).to.equal(200);
				done();
				
			});
		});

		it('POST /projects', function (done) {
			var prj={
				name:'Project8000259800000'
			};
			postProject
			.createProject(prj, function (project) {
				expect(project.status).to.equal(200);
				console.log(project.body.id);
				
				delProject
				.deleteProject(project.body.id, function (res) {
					expect(res.status).to.equal(204);
					done();
				});
				
			});
		});
	});

	describe('Service Projects by ID', function () {

		it('GET /projects/{project_id}', function (done) {
			var id=-1;
			var prj={
				name:'Project80007400721000'
			};
			postProject
			.createProject(prj,function (res) {
				expect(res.status).to.equal(200);
				id=res.body.id;

				getProject
				.getProject(id, function (res) {
					expect(res.status).to.equal(200);

					delProject
					.deleteProject(id, function (res) {
						expect(res.status).to.equal(204);
						done();
					});
				});
			});
		});

		it('PUT /projects/{project_id}', function (done) {
			var id=-1;
			var prj={name:'Project800037520000'};
			var editprj={name:'Change of Names Project'};
			postProject
			.createProject(prj,function (res) {
				expect(res.status).to.equal(200);
				id=res.body.id;

				putProject
				.editProject(editprj,id,function (res) {
					expect(res.status).to.equal(200);

					delProject
					.deleteProject(id, function (res) {
						expect(res.status).to.equal(204);
						done();
					});

				});
			});
		});

		it('DELETE /projects/{project_id}', function (done) {
			var id=-1;
			var prj={
				name:'Project8001240000000'
			};
			postProject
			.createProject(prj,function (res) {
				expect(res.status).to.equal(200);
				id=res.body.id;
				
				delProject
				.deleteProject(id, function (res) {
				expect(res.status).to.equal(204);
				done();
				});
			});
		});

	});

	
});