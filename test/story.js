/*
@author Jhasmany Quiroz
@class STORIES for Test Cases the Services of 'Stories'.
 */

var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

var config = require('..//config');
var tokenAPI = require('../lib/tokenAPI');
var storyApi = require('../lib/storyApi');


/**
 * @param  Test to Service's Story
 * @return Passing or Failing of Test Case executed.
 */
describe('STORY of Project', function(){
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;

	before('Getting the token', function(done){
		tokenAPI
			.getToken(userCredential, function(res){				
				token = res.body;
				console.log(token);
				expect(token.username).to.equal(userCredential.userAccount);
				done();
			});
	});	

	it.only('GET /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.getStory(projectId, storyId, token.api_token, function(res){
				expect(res).to.equal(404);
				done();
			});
	});

	it('PUT /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.putStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);				
				done();
			});
	});

	it('DELETED /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.deleteStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);				
				done();
			});
	});
});