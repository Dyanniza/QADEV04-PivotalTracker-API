// ACTIVITY TESTS
var expect =  require('chai').expect;
var request = require('superagent');
//require('superagent-proxy')(request);

describe('ACTIVITYS ABOUT THE PROJECT, OWNER', function(){
  this.timeout(10000);
  //return list of the selected activity for the authenticated person.
  it('GET /my/activity', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/my/activity')
      //.proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  //return list of the selected project activity.
  it('GET /projects/{project_id}/activity', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/projects/1448488/activity')
      //.proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  //return list of the selected story's activity.
  it('GET /projects/{project_id}/stories/{story_id}/activity', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/projects/1448488/stories/105577028/activity')
      //.proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(200);
      done();
    });
  });//it

  //return list of the selected epic's activity.
  it.only('GET /projects/{project_id}/epics/{epic_id}/activity', function (done) {
    request
      .get('https://www.pivotaltracker.com/services/v5/projects/1448488/epics/555/activity')
      //.proxy('http://172.20.240.5:8080')
      .set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
    .end(function(err, res){
      console.log(res.body);
      expect(res.status).to.equal(404);
      done();
    });
  });//it
});//describe