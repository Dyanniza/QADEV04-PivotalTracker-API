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
	this.timeout(10000);

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

	/*after('Deleting the token', function(done){
		tokenAPI
			.deleteToken(tk, function(res){	
				var tkDeleted = res.body;
				expect(tkDeleted.api_token).to.equal(tk.api_token);
				tk = null;
				done();
			});
	});*/

	it.only('GET /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.getStory(projectId, storyId, token.api_token, function(res){
				expect(res).to.equal(404);

				done();
			});
	});//it

	it('PUT /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.putStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);
				console.log('RESPONSE: ', res);

				done();
			});
	});//it

	it.only('DELETED /projects/{project_id}/stories/{story_id}', function (done) {
		projectId = storyId = -1;
		storyApi
			.deleteStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);
				console.log('RESPONSE: ', res);

				done();
			});
	});//it	
});//describe