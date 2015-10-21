/*
@author Jhasmany Quiroz
@class STORIES for Test Cases the Services of 'Stories'.
 */

var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

var config = require('../config');
var tokenAPI = require('../lib/tokenAPI');
var storiesApi = require('../lib/storiesApi');


/**
 * @param  Test to Service's Stories
 * @return Passing or Failing of Test Case executed.
 */
describe('STORY of Project', function() {
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;

	before('Getting the token', function(done) {
		tokenAPI
			.getToken(userCredential, function(res) {
				token = res.body;				
				expect(token.username).to.equal(userCredential.userAccount);
				done();
			});
	});	

	it('GET /projects/{project_id}/stories', function(done) {
		projectId = -1;
		storiesApi
			.getStories(projectId, token.api_token, function(res) {
				expect(res).to.equal(404);
				done();
			});
	});

	it.only('POST /projects/{project_id}/stories', function(done) {
		projectId = -1;
		storiesApi
			.postStories(projectId, token.api_token, function(res) {
				expect(res.code).to.equal(config.codeStories);				
				done();
			});
	});
});