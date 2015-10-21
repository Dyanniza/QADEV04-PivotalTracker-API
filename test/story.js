/*
@author Jhasmany Quiroz
@Class STORIES for Test Cases the Services of 'Stories'.
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
				console.log('BEFORE: ',token);
				expect(token.username).to.equal(userCredential.userAccount);
				done();
			});
	});	

	it('GET /projects/{project_id}/stories/{story_id}', function (done) {
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
 
	it.only('GET /projects/{project_id}/stories/{story_id}/owners', function (done) {
			projectId = storyId = -1;
			storyApi
				.getStoryOwner(projectId, storyId, token.api_token, function(res){
					console.log('RESPONSE: '+res);
					expect(res).to.equal(404);
					done();
				});
	});	
});
/*
//STORY-ID
describe('STORY of Project', function(){
	this.timeout(config.timeout);

  	it('GET /stories/{story_id}', function (done) {
    	request
      	.get('https://www.pivotaltracker.com/services/v5/stories/105577028')
      	.proxy('http://172.20.240.5:8080')
      	.set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  it('PUT /stories/{story_id}', function (done) {
    request
      .put('https://www.pivotaltracker.com/services/v5/stories/105577028')
      .proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
      .set('Content-Type', 'application/json')
      .send({'name':'User Story #2 modified by put test [storyID]'})
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  it.only('DELETED /stories/{story_id}', function (done) {
    request
      .del('https://www.pivotaltracker.com/services/v5/stories/55')
      .proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
      .set('Content-Type', 'application/json')
      .send({'name':'User Story #2 modified by put test [storyID]'})
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(404);
      done();
    });
  });
});//describe

//OWNER
describe('STORY of Project', function(){
  this.timeout(10000);

  it('GET /projects/{project_id}/stories/{story_id}/owners', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/projects/1448488/stories/105577028/owners')
      .proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  it('POST /projects/{project_id}/stories/{story_id}/owners', function (done) {
    request
      .post('https://www.pivotaltracker.com/services/v5/projects/1448488/stories/105577028/owners')
      .proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
      .set('Content-Type', 'application/json')
      .send({'name':'User Story #2 of Api Testing v1.0'})
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(400);
      done();
    });
  });//it

  it.only('DELETED /projects/{project_id}/stories/{story_id}/owners/{person_id}', function (done) {
    request
      .put('https://www.pivotaltracker.com/services/v5/projects/1448488/stories/105577028/owners/')
      .proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
      .set('Content-Type', 'application/json')
      .send({'name':'User Story #2 modified by put test'})
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(404);
      done();
    });
  });
});//describe*/