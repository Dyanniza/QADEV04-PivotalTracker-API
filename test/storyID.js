// STORYID TESTS
var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

describe('STORY of Project', function(){
  //this.timeout(10000);

  it('GET /stories/{story_id}', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/stories/105577028')
      //.proxy('http://172.20.240.5:8080')
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
      //.proxy('http://172.20.240.5:8080')
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
      //.proxy('http://172.20.240.5:8080')
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