/*
@author Jhasmany Quiroz
@Class STORIES for Test Cases the Services of 'Stories'.
 */
var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');

/**
 * @param  Test to Service's Stories
 * @return Passing or Failing of Test Case executed.
 */
describe('STORIES OF PROJECT', function(){
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;
	var chance = new Chance();

	before('GETTING THE TOKEN AND CREATED THE FILES', function(done) {
		tokenAPI
			.getToken(userCredential, function(res) {
				token = res.body;
				expect(token.username).to.equal(userCredential.userAccount);

          		var newProject = {
      				name: chance.string()
  				};

  				var projectsEndPoint = endPoints.projects.projectsEndPoint;
          		generalLib
          			.post(newProject, token.api_token, projectsEndPoint, function(res){
          				expect(res.status).to.equal(config.status.ok);
          				projectId = res.body.id;
          				done();
          			});
			});
	});

	after('DELETED THE FILES', function (done) {
		var endPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', projectId);
    	generalLib
    		.del(token.api_token, endPoint, function(res){
    			expect(res.status).to.equal(config.status.noContent);
    			projectId = -1;
        		storyId = -1;
        		done();
    		});
  	});

	it('GET /projects/{project_id}/stories', function(done) {
		var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', projectId);
		generalLib
			.get(token.api_token, storiesEndPoint, function(res) {
				expect(res.status).to.equal(config.status.ok);
				done();
			});
	});

	it('POST /projects/{project_id}/stories', function(done) {
		var storyEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', projectId);
		var story = {
    		name: chance.string()
  		};
		generalLib
			.post(story, token.api_token, storyEndPoint, function(res){
				expect(res.code).to.equal(config.codeStories);
				done();
			});
	});
});