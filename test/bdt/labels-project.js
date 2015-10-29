/*
@author Cecilia  Chalar 
@Label s testin
*/
/*
Given a empty Project named:"Pivotal Tracker Project--01"
And 1 label "labprj" is added to 'Project scenario1'
And 2 story with 3 new labels 'label1', 'label2' and 'label3' were added  to the project 

When the story that containing the 3 labels are deleted
	Then the labels are removed from the project.
	And only the label added "labprj" should be in the project 
*/



var expect = require('chai').expect;
var Chance = require('chance');
var chance = new Chance();
require('it-each')();

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
//var storyId = null;
var labelId = null;
var labelIdPrj = null;
var storyId = [];


describe('The project without Labels ', function() {
	this.timeout(config.timeout);

    before('Get Token and create a Project', function(done) {

        tokenAPI
            .getToken(userCredentials, function(res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;                
		        httpMethod

		            .post(projectData, token, projectsEndPoint, function(res) {
		            console.log(projectsEndPoint);
		            console.log(res.body);
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

    context.skip('Given a empty Project named:"Pivotal Tracker Project--01"',function(){

    	var labelsPost = [{name:'post1'}, {name:'post2'}];

        it.each(labelsPost, 'And 2 labels are added to the Project', function(element, done) {

            endPointLabels = labelsProjectEndPoint.replace('{project_id}', projectId);
            console.log(endPointLabels);
            httpMethod
                .post(element.name, token, endPointLabels, function(res) {
                    expect(res.status).to.equal(status.ok);
                    console.log(res.status);
                    //expect(res.body.name).to.equal(element.story.name);
                   // expect(res.body.estimate).to.equal(element.story.estimate);
                   // expect(res.body.current_state).to.equal(element.story.current_state);
                  //  storyId.push(res.body.id);
                    done();
                });

        });


    });


});