//Smoke test for labels
//Author: Cecilia Chalar

///projects/{project_id}/labels

var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);



describe('Smoke test for labels',function(){
	this.timeout(10000);

	describe('Service projects by project_id /projects/{project_id}/labels',function(){

		it('GET /projects/{project_id}/labels',function(done){

			var project_id = -1;
			request
				.get('https://www.pivotaltracker.com/services/v5/projects/1447838/labels?date_format=millis')
				.proxy('http://172.20.240.5:8080')
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
				});

		});

		it('POST /projects/{project_id}/labels',function(done){
			var content = {
					name : 'labe'											
				};

			request
				.post('https://www.pivotaltracker.com/services/v5/projects/1447838/labels')
				.proxy('http://172.20.240.5:8080')
				
				.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
				.type('application/json')
				.send(content)

			.end(function(err,res){
				expect(res.status).to.equal(200);
				done();
				});


		});

	});





	

	it('GET /projects/{project_id}/labels/{label_id}',function(done){
		request
			.get('https://www.pivotaltracker.com/services/v5/projects/1447838/labels/13078902')
			.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});

	it('GET /projects/{project_id}/stories/{story_id}/labels',function(done){
		request
			.get('https://www.pivotaltracker.com/services/v5/projects/1447838/stories/105799946/labels')
			.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});

	


	
	it('POST /projects/{project_id}/stories',function(done){
		var content = {

				name : 'labeltest2',
				labels:['labelREST']											
			};

		request
			.post('https://www.pivotaltracker.com/services/v5/projects/1447838/stories')
			.proxy('http://172.20.240.5:8080')
			.send(content)
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			//.type('application/json')

		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});

	it('POST /projects/{project_id}/stories/{story_id}/labels',function(done){
		var content = {

				name : 'post3'
															
			};

		request
			.post('https://www.pivotaltracker.com/services/v5/projects/1447838/stories/105799946/labels')
			.proxy('http://172.20.240.5:8080')
			.send(content)
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			//.type('application/json')

		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});


	it('PUT /projects/{project_id}/labels/{label_id}',function(done){
		var content = {
				name : 'lput'											
			};

		request
			.put('https://www.pivotaltracker.com/services/v5/projects/1447838/labels/13076852')
			.proxy('http://172.20.240.5:8080')
			.send(content)
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			.type('application/json')

		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});



	it.skip('DELETE /projects/{project_id}/labels/{label_id}',function(done){
		request
			.del('https://www.pivotaltracker.com/services/v5/projects/1447838/labels/13076852')
			.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			//.set('Content-Type', 'application/json')
			.type('application/json')
		.end(function(err,res){
			expect(res.status).to.equal(204);
			done();
		});

	});

		it.skip('DELETE /projects/{project_id}/stories/{story_id}/labels/{label_id}',function(done){
		request
			.del('https://www.pivotaltracker.com/services/v5/projects/{project_id}/stories/{story_id}/labels/{label_id}')
			.proxy('http://172.20.240.5:8080')
			.set('X-TrackerToken','d302f357ddd835b319b50bb8c2ea4e69')
			//.set('Content-Type', 'application/json')
			.type('application/json')
		.end(function(err,res){
			expect(res.status).to.equal(200);
			done();
		});

	});
	
});

