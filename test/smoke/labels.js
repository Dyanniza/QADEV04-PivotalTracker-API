/*
@author Cecilia Chalar
@class LABELs for Test Cases the Services of Labels using General library.
 */
var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

var endPoints = require('../../resources/endPoints.json');
var config = require ('../../resources/config.json');
var httpMethod = require ('../../lib/generalLib.js');
var tokenAPI = require ('../../lib/tokenAPI');
 

var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
//var labelsOfProjectEndPoint = endPoints.labels.labelsOfProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;

//var projectId = '1447838';
//var storyID = '106308134';
//var labelId = '13076852';

var userCredentials = config.userCredential;
var token = null;
var endPoint = null;
var projectId = null;
var storyID = null;
var labelId = null;

describe('Smoke test for labels',function(){
	this.timeout(10000);

	 before('Get Token', function (done) {
        tokenAPI
            .getToken(userCredentials, function (res) {
                expect(res.status).to.equal(200);
                token = res.body.api_token;                
                done();                
            });
    });   

	before('Create a Project', function (done) {
		endPoint = projectsEndPoint;
		var al = Math.random().toString(36).substring(2);
		var prjId = al.substr(0,3);
		var content = {
					name : 'ProjectToTestLabels'+prjId										
				};		

		httpMethod				
				.post(content,token,endPoint,function (res){
					expect(res.status).to.equal(200);
					projectId = res.body.id;					
					done();
				});
	});
	
	after('Deleting Project', function (done) {
        var endPoint = projectByIdEndPoint.replace('{project_id}', projectId)  
        httpMethod
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(204);
                    projectId = null;
                    done();                    
                });            
        });


	describe('Suite of tests for endpoind: /projects/{project_id}/labels',function(){

		endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
		it('GET /projects/{project_id}/labels',function(done){
						
			httpMethod			
				
				.get(token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});			
		});
		
		it('POST /projects/{project_id}/labels',function(done){
		//endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
			var al = Math.random().toString(36).substring(2);
			var labelName = al.substr(0,4);
			var content = {
					name : labelName											
				};
			httpMethod
				
				.post(content,token,endPoint,function(res){
					expect(res.status).to.equal(200);
					label_id = res.body.id;
					done();
				});

		});
	
	});

	
	describe('Test suite for endPoint: /projects/{project_id}/labels/{label_id}',function(){

		endPoint = labelByIdProjectIdEndPoint.replace('{project_id}',projectId).replace('{label_id}',labelId);

		it('GET /projects/{project_id}/labels/{label_id}',function(done){
			console.log(endPoint);
			httpMethod							
				
				.get(token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});	

		});

		it.skip('PUT /projects/{project_id}/labels/{label_id}',function(done){
			var al = Math.random().toString(36).substr(2);
			var newLabelName = al.substr(0,4);
			var content = {
					name : newLabelName											
				};
			console.log(endPoint);
			httpMethod
				
				.put(content,token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});					
		});

		it.skip('DELETE /projects/{project_id}/labels/{label_id}',function(done){
			httpMethod
				
				.del(token,endPoint,function(res){
					expect(res.status).to.equal(204);
					done();
				});	

		});
	});
	
	describe ('test suite endPoint: /projects/{project_id}/stories/{story_id}/labels',function(){


		beforeEach('Create precondition, at least story in the project',function(done){	
			var eP = storiesEndPoint.replace('{project_id}',projectId);		
			var content = {
					name : 'Story to test a label'															
			};

			httpMethod				
				.post(content,token,eP,function(res){
					expect(res.status).to.equal(200);
					storyID = res.body.id;
					done();
				});
		});		

		it('GET /projects/{project_id}/stories/{story_id}/labels',function(done){
			var endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
			httpMethod			
				
				.get(token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});	

		});

		it('POST /projects/{project_id}/stories/{story_id}/labels',function(done){
			var endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
			var al = Math.random().toString(36).substr(2);
			var labelName = al.substr(0,4);
			var content = {
					name : labelName											
				};

			httpMethod
				
				.post(content,token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});

		});

	});


	describe ('test suite endPoint: /projects/{project_id}/stories/{story_id}/labels/{label_id}',function(){
	
		it.skip('DELETE /projects/{project_id}/stories/{story_id}/labels/{label_id}',function(done){
			var endPoint = labelIdStoryIdProjectIdEndPoint.replace('{project_id}',projectId).replace('{story_id}',storyID).replace('{label_id}',labelId);
			httpMethod				
				.del(token,endPoint,function(res){
					expect(res.status).to.equal(204);
					done();
				});	

		});				
		
	});

	describe ('Labels services,endPoint: /projects/{project_id}/stories}',function(){		

		it('POST /projects/{project_id}/stories',function(done){
			console.log(projectId);
			console.log(storiesEndPoint);

			var endPointP = storiesEndPoint.replace('{project_id}',projectId);
			console.log(endPointP);
			var al = Math.random().toString(36).substring(2);
			var labelName = al.substr(0,4);
			var content = {
					name : 'Story to test a label',
					labels : ['labelName']											
				};

			httpMethod
				
				.post(content,token,endPointP,function(res){
					expect(res.status).to.equal(200);
					done();
				});

		});	

	});	
	
});






