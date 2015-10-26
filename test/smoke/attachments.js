/*
@author Cecilia Chalar
@class Attachments for Test Cases the Services of Labels using General library.
 */

var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

var endPoints = require('..\\..\\endPoints.json');
var config = require ('..\\..\\config.json');
var httpMethod = require ('../../lib/generalLib.js');
var tokenAPI = require ('../../lib/tokenAPI');

var attachEndPoint = endPoints.labels.labelsProjectEndPoint;


var userCredentials = config.userCredential;
var token = null;
var projectId = null;
var storyId = null;
var commentId = null;

describe('Suite attachments smoke test',function (){
	this.timeout(10000);

	 before('Get Token', function (done) {
        tokenAPI
            .getToken(userCredentials, function (res) {
                expect(res.status).to.equal(200);
                token = res.body.api_token;                
                done();                
            });
    });   

	 beforeEach('Creating Pre Conditions', function (done) {
           var projectName = { name : chance.string()};
           var storyName = { name: chance.string()};
           var commtContain = { description : chance.sentence({words: 5})};
           
           methods
           		.post(prj, token, projectsEndPoint,  function(res) {
                	expect(res.status).to.equal(200);
                	projectId  = res.body.id;
                	endPoint = storiesEndPoint.replace('{project_id}', projectId );
                	
                	methods
                    .post(story, token, endPoint, function(res) {
                        storyId = res.body.id;
                       	endPoint = storiesTasksEndPoint.replace('{project_id}', projectId )
                       								   .replace('{story_id}', storyId);
                        
                        methods
                            .post(taskName, token, endPoint, function(res) {
                                expect(res.status).to.equal(200);
                                taskId = res.body.id;
                                endPoint = storiesTasksByIdEndPoint.replace('{project_id}', projectId)
        									   					   .replace('{story_id}', storyId)
        									   					   .replace('{task_id}', taskId);
                                
                                done();
	                        });
                    });
               	});
        });

	    afterEach('Deleting project....', function (done) {
        	endPoint = projectByIdEndPoint.replace('{project_id}', projectId );
            methods
                .del(token, endPoint, function(res) {
                    expect(res.status).to.equal(204);
                    var projectId = null;
					var storyId = null;
                    enPoint = null;
                    done();
            	});
        });

        var endPoint = labelsProjectEndPoint.replace('{project_id}',projectId);
		it('GET /projects/{project_id}/labels',function(done){
						
			httpMethod			
				
				.get(token,endPoint,function(res){
					expect(res.status).to.equal(200);
					done();
				});			
		});








});