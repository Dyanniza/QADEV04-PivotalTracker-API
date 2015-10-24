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

var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;

var userCredentials = config.userCredential;
var token = null;
var endPoint = null;
var projectId = null;
var storyID = null;
var labelId = null;

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
    var commtContain = { text : chance.sentence({words: 6})}

        httpMethod

            .post(projectName, token, projectsEndPoint,  function(res) {
                expect(res.status).to.equal(status.ok);
                projectId = res.body.id;
                endPoint = storiesEndPoint.replace('{project_id}', projectId );
                    
                    httpMethod
                    .post(storyName, token, endPoint, function(res) {
                        storyId = res.body.id;
                        endPoint = commentsStoryIdEndPoint.replace('{project_id}', projectId )
                                                          .replace('{story_id}', storyId);
                        
                        httpMethod
                            .post(commtContain, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                commentId = res.body.id;
                                endPoint = attsStoryPrjIdEndPoint.replace('{project_id}', projectId)
                                                                 .replace('{story_id}', storyId)
                                                                 .replace('{comment_id}', commentId);
                                
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
    describe('Test suite for Post methods',function(){

    	it('POST /projects/{project_id}/labels',function(done){
		endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);					
			var content = {
					name : chance.string()											
				};
			httpMethod				
				.post(content,token,endPoint,function(res){
					expect(res.status).to.equal(200);
					label_id = res.body.id;
					done();
				});

		});

    });



});


