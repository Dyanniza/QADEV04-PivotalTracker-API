/*
@author Cecilia Chalar
@class SMOKE Tests for Services of Labels.
 */

var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var label = require('../../lib/labelsAPI');

var projectId = '1447838';
var storyID = '106308134';
var labelId = '13076852';
var story_id = -1;


describe('Smoke test for labels',function(){
	this.timeout(10000);

	describe('Service projects by project_id /projects/{project_id}/labels',function(){

		it('GET /projects/{project_id}/labels',function(done){

			var project_id = -1;
			request
				.get('https://www.pivotaltracker.com/services/v5/projects/1447838/labels?date_format=millis')
				.proxy('http://172.20.240.5:8080')
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
				});

		});

		it('POST /projects/{project_id}/labels',function(done){
			var al = Math.random().toString(36).substr(2);
			var labelName = al.substr(0,4);
			var content = {
					name : labelName											
				};
			label
				.postLabel(projectId,content,function(res){
					expect(res.status).to.equal(200);
					done();

				});			

		});
	});


	describe('Labels services, endPoint: /projects/{project_id}/labels/{label_id}',function(){

		it('GET /projects/{project_id}/labels/{label_id}',function(done){
			request
				.get('https://www.pivotaltracker.com/services/v5/projects/1447838/labels/13078902')
				.proxy('http://172.20.240.5:8080')
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
			});

		});

		it('PUT /projects/{project_id}/labels/{label_id}',function(done){
			var al = Math.random().toString(36).substr(2);
			var newLabelName = al.substr(0,4);
			var content = {
					name : newLabelName											
				};

			label
				.putLabel(projectId,labelId, content,function(res){
					expect(res.status).to.equal(200);
					done();

				});				
		});

		it.skip('DELETE /projects/{project_id}/labels/{label_id}',function(done){
			storyID = -1;
			label
				.deleteLabel(projectId,storyID,labelId, content,function(res){
					expect(res.status).to.equal(200);
					done();

				});

		});
	});

	describe ('Labels services,endPoint: /projects/{project_id}/stories/{story_id}/labels',function(){

		it('GET /projects/{project_id}/stories/{story_id}/labels',function(done){
			request
				.get('https://www.pivotaltracker.com/services/v5/projects/1447838/stories/105799946/labels')
				.proxy('http://172.20.240.5:8080')
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
			});

		});

		it.skip('POST /projects/{project_id}/stories/{story_id}/labels',function(done){
			var content = {

					name : 'post3'
																
				};

			request
				.post('https://www.pivotaltracker.com/services/v5/projects/1447838/stories/105799946/labels')
				.proxy('http://172.20.240.5:8080')
				.send(content)
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
				.type('application/json')

			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
			});

		});


	});

	describe ('Labels services,endPoint: /projects/{project_id}/stories/{story_id}/labels/{label_id}',function(){

		it.skip('DELETE /projects/{project_id}/stories/{story_id}/labels/{label_id}',function(done){
			label
				.deleteLabel(projectId,storyID,labelId, content,function(res){
					expect(res.status).to.equal(200);
					done();

				});
		
	});


	describe ('Labels services,endPoint: /projects/{project_id}/stories}',function(){

		it('POST /projects/{project_id}/stories',function(done){
				var content = {

						name : 'labeltest2',
						labels:['labelREST']											
					};

				request
					.post('https://www.pivotaltracker.com/services/v5/projects/1447838/stories')
					.proxy('http://172.20.240.5:8080')
					.send(content)
					.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
					.type('application/json')

				.end(function(err,res){
					expect(res.status).to.equal(200);
					done();
				});

			});

		});	

	});
	
});

