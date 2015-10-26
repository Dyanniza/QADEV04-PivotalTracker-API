/*
@author Jhasmany Quiroz
@Class STORY for Test Cases the Services of 'Story'.
 */
var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var stories = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');
var crudConfig = require('../../resources/crudConfig');

 /**
 * End point services
 */
var storyEndPoint = endPoints.story;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var project_id = null;
var argument = crudConfig.stories.post;
var userCredential = config.userCredential;
var status = config.status;
var chance = new Chance();
var newProject = {name: chance.string()};
var story = {name: chance.string(), id: -1};
var owner = {name: chance.string(), id: chance.integer()};
var ownerId = {id: -1};
crudConfig = crudConfig.story;

describe('CRUD Test for Projects Service Pivotal Tracker', function () {
  this.timeout(config.timeout);
  
      before('Getting Token.....', function (done) {
        getToken
            .getToken(userCredential, function (res) {                
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;                
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                stories
                    .post(newProject, token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        project_id = res.body.id;
                        done();
                    });
            });
    });

  after('DELETED THE FILES', function(done) {
      var projectEndPoint = endPoints.projects.projectByIdEndPoint.replace('{project_id}', project_id);
      stories
          .del(token, projectEndPoint, function (res) {
              expect(res.status).to.equal(config.status.noContent);
              done();
          });
  });

  describe('Post methods', function () {      
      before('CREATE story', function (done) {
          var storiesEndPoint = endPoints.stories.storiesEndPoint.replace('{project_id}', project_id);
              stories
                  .post(story, token, storiesEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.ok);
                      story.id = res.body.id;

                      var meEndPoint = endPoints.me.meEndPoint;
                          stories
                              .get(token, meEndPoint, function(res) {
                                  expect(res.status).to.equal(config.status.ok);
                                  ownerId.id = res.body.id;                                  
                                  done();
                              });
                  });
      });

      it('POST /projects/{project_id}/stories/{story_id}/owners', function (done) {
          var storyOwnersEndPoint = endPoints.story.storyOwnersEndPoint.replace('{project_id}', project_id);
          storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', story.id);
          stories
              .post(ownerId, token, storyOwnersEndPoint, function(res) {
                  expect(res.status).to.equal(config.status.ok);
                  expect(res.body.kind).to.equal(crudConfig.post.kind);
                  expect(res.body.name).to.equal(crudConfig.post.name);
                  expect(res.body.email).to.equal(crudConfig.post.email);
                  expect(res.body.initials).to.equal(crudConfig.post.initials);
                  expect(res.body.username).to.equal(crudConfig.post.username);
                  crudConfig.post.id = res.body.id;
                  done();
            });
      });

      describe('Read and Edit ', function () {
          it('GET /projects/{project_id}/stories/{story_id}/owners', function (done) {
              var storyOwnersEndPoint = endPoints.story.storyOwnersEndPoint.replace('{project_id}', project_id);
              storyOwnersEndPoint = storyOwnersEndPoint.replace('{story_id}', story.id);
              stories
                  .get(token, storyOwnersEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.ok);
                      expect(res.body[0].kind).to.equal(crudConfig.post.kind);
                      expect(res.body[0].story_type).to.equal(crudConfig.post.story_type);
                      expect(res.body[0].current_state).to.equal(crudConfig.post.current_state);                  
                      expect(res.body[0].labels).to.eql(crudConfig.post.labels);
                      done();
                  });
          });

          it('GET /projects/{project_id}/stories/{story_id}', function (done) {
              var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', project_id);
              storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
              stories
                  .get(token, storyEndPoint, function (res) {
                      expect(res.status).to.equal(config.status.ok);
                      expect(res.body.kind).to.equal(crudConfig.get.kind);
                      expect(res.body.story_type).to.equal(crudConfig.get.story_type);
                      expect(res.body.current_state).to.equal(crudConfig.get.current_state);                  
                      expect(res.body.labels).to.eql(crudConfig.get.labels);
                      done();
                  });
          });

          it('GET /stories/{story_id}', function (done) {
              var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
              stories
                  .get(token, storyIdEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.ok);
                      expect(res.body.kind).to.equal(crudConfig.get.kind);
                      expect(res.body.story_type).to.equal(crudConfig.get.story_type);
                      expect(res.body.current_state).to.equal(crudConfig.get.current_state);                  
                      expect(res.body.labels).to.eql(crudConfig.get.labels);
                      done();
                  });
          });

          it('PUT /projects/{project_id}/stories/{story_id}', function (done) {
              var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', project_id);
              storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
              story.name = chance.string();
              crudConfig.put.name = story.name;
              stories
                  .put(story, token, storyEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.ok);
                      expect(res.body.name).to.equal(crudConfig.put.name);
                      expect(res.body.kind).to.equal(crudConfig.get.kind);
                      expect(res.body.story_type).to.equal(crudConfig.get.story_type);
                      expect(res.body.current_state).to.equal(crudConfig.get.current_state);                  
                      expect(res.body.labels).to.eql(crudConfig.get.labels);
                      done();
                  });
          });

          it('PUT /stories/{story_id}', function (done) {
              var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
              story.name = chance.string();
              crudConfig.put.name = story.name;
              stories
                  .put(story, token, storyIdEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.ok);
                      expect(res.body.name).to.equal(crudConfig.put.name);
                      done();
                  });
          });

          it('DELETE /projects/{project_id}/stories/{story_id}/owners/{person_id}', function (done) {
              var storyOwnerIdEndPoint = endPoints.story.storyOwnerIdEndPoint.replace('{project_id}', project_id);
              storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('{story_id}', story.id);
              storyOwnerIdEndPoint = storyOwnerIdEndPoint.replace('{person_id}', ownerId.id);
              stories
                  .del(token, storyOwnerIdEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.noContent);
                      expect(res.body.status).to.be.empty;
                      done();
                  });
          });

          it('DELETE /stories/{story_id}', function (done) {
              var storyIdEndPoint = endPoints.story.storyIdEndPoint.replace('{story_id}', story.id);
              stories
                  .del(token, storyIdEndPoint, function(res) {
                      expect(res.status).to.equal(config.status.noContent);
                      expect(res.body.status).to.be.empty;
                      done();
                  });            
          });          
      });
  });
});