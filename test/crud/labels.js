/*
@author Cecilia  Chalar 
@Class Labels for for CRUD testing .
*/

var expect = require('chai').expect;
var request = require('superagent');
var Chance = require('chance');
var chance = new Chance();
require('superagent-proxy')(request);

var endPoints = require('../../resources/endPoints.json');
var config = require ('../../resources/config.json');
var httpMethod = require ('../../lib/generalLib.js');
var tokenAPI = require ('../../lib/tokenAPI');
var configLog = require('../../resources/crudConfig.json');

var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;

var userCredentials = config.userCredential;
var status = config.status;
var token = null;
var endPoint = null;
var projectId = null;
var storyID = null;
var labelId = null;

var prj = configLog.project.post;
var story = configLog.stories.post;
var labName = configLog.labels.post.name;
var kind = configLog.labels.type;

describe('Suite of CRUD test for Labels',function(){
	this.timeout(10000);

    before('Get Token', function (done) {
        tokenAPI
            .getToken(userCredentials, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;                
                done();                
            });
    });   
   

    beforeEach('Creating Pre Conditions at least a project', function (done) {
    var projectName = { name : chance.string()};
    var storyName = { name: chance.string()};
    var contentLab = { name: 'label'};

        httpMethod

            .post(projectName, token, projectsEndPoint,  function(res) {
                expect(res.status).to.equal(status.ok);
                projectId = res.body.id;
                endPoint = storiesEndPoint.replace('{project_id}', projectId );
                    
                    httpMethod
                    .post(storyName, token, endPoint, function(res) {
                        storyId = res.body.id;
                        endPoint = labelsByStoryIdEndPoint.replace('{project_id}', projectId )
                                                          .replace('{story_id}', storyId);
                                                          console.log(endPoint);
                        
                        httpMethod
                            .post (contentLab, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                labelId = res.body.id;
                                endPoint = labelIdStoryIdProjectIdEndPoint.replace('{project_id}', projectId)
                                                                 .replace('{story_id}', storyId)
                                                                 .replace('{label_id}', labelId);
                                                                 console.log(endPoint);
                                
                                done();
                            });
                    });
            });
    });

	afterEach('Deleting Project', function (done) {
        var endPoint = projectByIdEndPoint.replace('{project_id}', projectId)  
        httpMethod
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(204);
                    projectId = null;
                    done();                    
                });            
    });
    describe('Test suite for Put methods',function(){

    	it('POST /projects/{project_id}/labels',function(done){
        
		endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);	
        			
			var content = {
					name : 'port'											
				};
			httpMethod				
				.post(content,token,endPoint,function(res){
					expect(res.status).to.equal(status.ok);                   
                    expect(res.body.kind).to.equal(kind);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labName)
                    label_id = res.body.id 
					done();
				});

		});

    });

    describe.skip('Test suite for Post methods',function(){

        it('PuT /projects/{project_id}/labels',function(done){
        
        endPoint = labelsProjectEndPoint.replace('{project_id}',projectId); 
                  
            var content = {
                    name : 'port'                                           
                };
            httpMethod              
                .put(content,token,endPoint,function(res){
                    expect(res.status).to.equal(status.ok);                   
                    expect(res.body.kind).to.equal(kind);
                    expect(res.body.project_id).to.equal(projectId);
                    expect(res.body.name).to.equal(labName)
                    label_id = res.body.id 
                    done();
                });

        });

    });



});


