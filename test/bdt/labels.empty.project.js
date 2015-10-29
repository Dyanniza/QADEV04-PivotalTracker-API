/*
@author Cecilia  Chalar 
@Label project 
*/
/*
Given a empty Project named:"Pivotal Tracker Project--01"
And 2 stories are added  with 3 new labels 'label1', 'label2' and 'label3' were added  to the project 

When the stories that containing the 3 labels are deleted
	Then the labels should be removed from the project.
	And the project is it empty 
*/



var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();

var endPoints = require('../../resources/endPoints.json');
var config = require('../../resources/config.json');
var httpMethod = require('../../lib/generalLib.js');
var tokenAPI = require('../../lib/tokenAPI');
var configLog = require('../../resources/crudConfig.json');


var labelsProjectEndPoint = endPoints.labels.labelsProjectEndPoint;
var labelsByStoryIdEndPoint = endPoints.labels.labelsByStoryIdEndPoint;
var storiesEndPoint = endPoints.label.storiesEndPoint;
var labelByIdProjectIdEndPoint = endPoints.label.labelByIdProjectIdEndPoint;
var labelIdStoryIdProjectIdEndPoint = endPoints.label.labelIdStoryIdProjectIdEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var storyIdEndPoint = endPoints.story.storyIdEndPoint;

var userCredentials = config.userCredential;
var status = config.status;
var story = configLog.stories.post;
var labName = configLog.labels.label.name;
var labNamePost = configLog.labels.post.name;
var labNamePut = configLog.labels.put.name;
var type = configLog.labels.kind;
var projectData = configLog.project.post;

var token = null;
var endPoint = null;
var endPointStory = null;
var endPointLabel = null;
var endPointLabels = null;
var projectId = null;

var labelIdPrj = null;
var storyId1 = null;
var storyId2 = null;
var labelId1 = null;
var labelId2 = null;


describe('The project without Labels ', function() {
	this.timeout(config.timeout);

    before('Get Token and create a Project', function(done) {

        tokenAPI
            .getToken(userCredentials, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;                
		        httpMethod

		            .post(projectData, token, projectsEndPoint, function(res) {
    		           
    		            expect(res.status).to.equal(status.ok);
    		            projectId = res.body.id;
                    	done();
            	});
    		}); 
    }); 

    after('Delete Project', function(done) {
        var endPoint = projectByIdEndPoint.replace('{project_id}', projectId)
        httpMethod
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                projectId = null;
                done();
            });
    });

    context('Given a empty Project named:"Pivotal Tracker Project--01"',function(){


        it ('And add a 2 story with a new label named newLab',function(done){
            var content = {
                name: chance.string(),
                labels: [labNamePost]
            };
            var content2 = {
                name: chance.string(),
                labels: [labNamePut]
            };
            endPoint = storiesEndPoint.replace('{project_id}', projectId);
            
            httpMethod

                .post(content, token, endPoint, function(res) {

                        expect(res.status).to.equal(status.ok);
                        expect(res.body.kind).to.equal('story');
                        expect(res.body.labels[0].kind).to.equal(type);
                        expect(res.body.labels[0].project_id).to.equal(projectId);
                        expect(res.body.labels[0].name).to.equal(labNamePost)
                        storyId1 = res.body.id;
                        httpMethod
                        .post(content2, token, endPoint, function(res) {

                                expect(res.status).to.equal(status.ok);
                                expect(res.body.kind).to.equal('story');
                                expect(res.body.labels[0].kind).to.equal(type);
                                expect(res.body.labels[0].project_id).to.equal(projectId);
                                expect(res.body.labels[0].name).to.equal(labNamePut)
                                storyId2 = res.body.id;
                        done();
                        });
            });
        });

        it ('And add the labels created before, two  stories ',function(done){
            var labelName1 = { name:labNamePost };
            var labelName2 = { name:labNamePut };
            
            endPointStory = labelsByStoryIdEndPoint.replace('{project_id}', projectId)
                                .replace('{story_id}', storyId1);
            httpMethod
                .post(labelName2, token, endPointStory, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.kind).to.equal(type);
                        expect(res.body.project_id).to.equal(projectId);

                        endPointStory = labelsByStoryIdEndPoint.replace('{project_id}', projectId)
                                .replace('{story_id}', storyId2);
                        httpMethod
                        .post(labelName1, token, endPointStory, function(res) {
                                expect(res.status).to.equal(status.ok);
                                expect(res.body.kind).to.equal(type);
                                expect(res.body.project_id).to.equal(projectId);
                                

                        done();
                        });
                });
        });

        it('When delete the stories',function(done){
            endPoint = storyIdEndPoint.replace('{story_id}', storyId1);
            httpMethod
                .del(token, endPoint, function(res) {
                      expect(res.status).to.equal(status.noContent);
                      expect(res.body.status).to.be.empty;
                       endPoint = storyIdEndPoint.replace('{story_id}', storyId2);

                      httpMethod
                          .del(token, endPoint, function(res) {
                                expect(res.status).to.equal(status.noContent);
                                expect(res.body.status).to.be.empty;
                           done();
                           });
                });                 

        });

        it('Then the project should be without stories and labels',function(done){
             endPoint = labelsProjectEndPoint.replace('{project_id}', projectId);

            httpMethod
                .get(token, endPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body[0].kind).to.equal(type);
                    expect(res.body[0].project_id).to.equal(projectId);                 
                    done();
                });
        });
    });
 });

