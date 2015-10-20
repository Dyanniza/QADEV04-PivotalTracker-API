// STORIE.JS

var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);

describe('STORY of Project', function(){
	this.timeout(10000);
	it.only('GET /projects/{project_id}/stories', function (done) {
		request
			.get('https://www.pivotaltracker.com/services/v5/projects/1448488/stories/')
			//.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
		.end(function(err, res){
			console.log(res.body);
			expect(res.status).to.equal(200);
			done();
		});
	});

	it('POST /projects/{project_id}/stories', function (done) {
		request
			.post('https://www.pivotaltracker.com/services/v5/projects/1448498/stories')
			//.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken', '15e4bbf7b3228e3d00b28418d930f68a')
			.set('Content-Type', 'application/json')
			.send({'name':'User Story #2 of Api Testing v1.0'})
		.end(function(err, res){
			console.log(res.body);
			expect(res.status).to.equal(200);
			done();
		});
	});
});