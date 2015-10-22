/*
@author Jhasmany Quiroz
@Class STORIES for Test Cases the Services of 'Stories'.
 */

var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../config');
var tokenAPI = require('../lib/tokenAPI');
var project = require('../lib/projectsAPI');
var postStories = require('../lib/postStoriesAPI');
var storyApi = require('../lib/storyApi');

/**
 * @param  Test to Service's Story
 * @return Passing or Failing of Test Case executed.
 */
describe('STORY of Project', function(){
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
  var chance = new Chance();
  var projectId = storyId = -1;

  var prj = {
      name: chance.string()
  };
  var story = {
    name: chance.string()
  };
  var owner = {
    name: chance.string(),
    id: chance.integer()
  };

	before('Getting the token', function(done) {
    tokenAPI
      .getToken(userCredential, function(res) {
        token = res.body;
        expect(token.username).to.equal(userCredential.userAccount);        

        project
          .createProject(prj, token.api_token, function(res) {
            expect(res.status).to.equal(200);
            projectId = res.body.id;

            postStories
              .createStories(story, projectId, function(res) {
                expect(res.status).to.equal(200);
                storyId = res.body.id;

                done();
              });
          });
      });
  });

  after('DELETED THE FILES', function (done) {
    project
      .deleteProject(projectId, token.api_token, function(res) {
        expect(res.status).to.equal(204);
        projectId = -1;
        storyId = -1;
        done();
      });
  });

	it('GET /projects/{project_id}/stories/{story_id}', function (done) {		
		storyApi
			.getStory(projectId, storyId, token.api_token, function(res){
				expect(res).to.equal(200);
				done();
			});
	});

	it('PUT /projects/{project_id}/stories/{story_id}', function (done) {
		storyApi
			.putStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);
				done();
			});
	});

	it('DELETED /projects/{project_id}/stories/{story_id}', function (done) {
		storyApi
			.deleteStory(projectId, storyId, token.api_token, function(res){
				expect(res.code).to.equal(config.codeStory);
				done();
			});
	});
 
	it('GET /projects/{project_id}/stories/{story_id}/owners', function (done) {
    storyApi
      .getStoryOwner(projectId, storyId, token.api_token, function(res){                  
        expect(res).to.equal(200);
        done();
    });
  });

  it('POST /projects/{project_id}/stories/{story_id}/owners', function (done) {    
    storyApi
      .postStoryOwner(owner, projectId, storyId, token.api_token, function(res){
        expect(res).to.equal(400);
        done();
      });    
  });

  it('DELETED /projects/{project_id}/stories/{story_id}/owners/{person_id}', function (done) {
    storyApi
      .postStoryOwner(owner, projectId, storyId, token.api_token, function(res){
        expect(res).to.equal(400);
        done();
      });    
  });

  it('GET /stories/{story_id}', function (done) {
    storyApi
      .getStoryId(storyId, token.api_token, function(res){
        expect(res).to.equal(200);
        done();
      });      
  });

  it('PUT /stories/{story_id}', function (done) {
    storyApi
      .putStoryId(story, storyId, token.api_token, function(res){
        expect(res).to.equal(200);
        done();
      });
  });

  it('DELETED /stories/{story_id}', function (done) {
    storyApi
      .deleteStoryId(storyId, token.api_token, function(res){
        expect(res).to.equal(204);
        done();
      });    
  });
});