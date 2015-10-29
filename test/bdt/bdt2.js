/*
Scenary 2:is added and removed project members in different iterations
Given I have a Project
Then four project memberships should add under project 
And the project has 10 user stories
And two user stories should be assigned to every member
And one user story should be finished per every member
And all user stories finished should pass to Delivered state
And the project should pass to the second iteration
When the project this in the second iteration
And the project has 5 user stories not started
And the project have 5 user Stories with delivered state
And the project has 5 members
Then one user story it should be finished per every member
And all user stories with Delivered state should pass to Accepted state
And one user story should be finished per every member
And the project should pass to third iteration
When the project pass to third iteration
When the project pass to third iteration
And the project has 5 user stories with accepted state
And the project has 5 user stories with finished state
And the project has 5 members
Then any user story should be on the ice box

*/

var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../resources/config.json');
var servicesAPI = require('../../lib/generalLib')
var endPoint = require('../../resources/endPoints.json');
var Chance = require('chance');
var crudConfig = require('../../resources/crudConfig.json');
var status = config.status;

require('it-each')();


describe('Scenary 2',function(){
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;
	var iterationEndPoint = null;
   // var prjByIdEndPoint = null;
    var chance = new Chance();
    var IDstories=[];
    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });
    before('Create Project',function(done){
		var prjByIdEndPoint = endPoint.projects.projectsEndPoint;
		    var prj = {
		        name: chance.string()
		    };
		    servicesAPI
		        .post(prj, token.api_token, prjByIdEndPoint, function(res) {
		            projectId = res.body.id;
		            expect(res.status).to.equal(status.ok);
		            done();
		        });
	});

	after('Delete the project', function(done){
		var delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
	    servicesAPI
	        .del(token.api_token, delEndPoint, function(res) {
	            expect(res.status).to.equal(status.noContent);
	            done();
	        });
	});



	context('Given I have a Project empty',function(){
		var members = [{email: 'Jhasmany.Quiroz@fundacion-jala.org', role: 'member'},
					   {email: 'jorge.avila@fundacion-jala.org', role: 'member'},
					   {email: 'penieldvp18@gmail.com', role: 'member'}];
		var story = [{name: 'argument1'}, {name: 'argument2'}, {name: 'argument3'},{name: 'argument4'},{name: 'argument5'},{name: 'argument6'}];

		it.each(members,'Then 2 project memberships should add under project', function(element, done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
		    servicesAPI
		        .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            done();
		        });
		});
		
		it.each(story,'And 6 user stories should be created under project',function(element,done){
			var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
			    .post(element, token.api_token, storyEndPoint, function(res) {
					expect(res.status).to.equal(status.ok);
					IDstories.push(res.body.id);
					done();	
				});
		});		
	});

	describe('When the project this in the fisrt iteration',function(){
		it('Then the projects iteration should be 1',function(done){
			var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

	        servicesAPI
	            .get(token.api_token, iterationEndPoint, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(1);
	                done();
	            });

		});
		it('And the project should have 4 members',function(done){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
	        servicesAPI
	            .get(token.api_token, endPointMember, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(4);
	                done();
	            });
		});
		/////////////
		it('Then 1 project memberships should remove to project', function(done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
		    servicesAPI
		        .post({email: 'penieldvp18@gmail.com', role: 'member'}, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            done();
		        });
		});
		it('And the project should pass to second iteration', function(done) {
	        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
	            .replace('{iteration_number}', 1);
	        servicesAPI
	            .put({"length":0}, token.api_token, iterationEndPoint, function(iteration) {
	                expect(iteration.status).to.equal(status.ok);
	                done();
	            });
	    });

	});
	describe('When the project this in the Second iteration',function(){
		it('Then the projects iteration should be 1',function(done){
			var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

	        servicesAPI
	            .get(token.api_token, iterationEndPoint, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(2);
	                done();
	            });

		});
		it('And the project should have 3 members',function(done){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
	        servicesAPI
	            .get(token.api_token, endPointMember, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(3);
	                done();
	            });
		});
		it.each(members,'Then 2 project memberships should add under project', function(element, done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
		    servicesAPI
		        .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            done();
		        });
		});

		it('And the project should pass to third iteration', function(done) {
	        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
	            .replace('{iteration_number}', 1);
	        servicesAPI
	            .put({"length":0}, token.api_token, iterationEndPoint, function(iteration) {
	                expect(iteration.status).to.equal(status.ok);
	                done();
	            });
	    });
	
	});




	/*
		it('And one user story should be finished for every member', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And all user stories finished should pass to Delivered state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And one member should remove to project', function(){
			var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', memberId);
	        servicesAPI
	            .del(token.api_token, prjMSEndPoint, function(projectMS) {
	                expect(projectMS.status).to.equal(status.noContent);
	                done();
	            });

		});
	});
	describe('When the project this in the second iteration',function(){
		it('then the project should has 2 members', function(){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(2);
		                done();
		            });
		});
		it('And the project has 3 user stories not started', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And the project have 3 user Stories with delivered state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('then one user story should be finished for every member', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });


		});
		it('And all user stories finished should pass to Delivered state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And all user stories Delivered should pass to Accepted state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });
		});
		it('And one member should remove to project', function(){
			var prjMSEndPoint = endPoint.projectMembership.operationPrjMembership.replace('{project_id}', projectId)
            .replace('{membership_id}', memberId);
	        servicesAPI
	            .del(token.api_token, prjMSEndPoint, function(projectMS) {
	                expect(projectMS.status).to.equal(status.noContent);
	                done();
	            });

		});
	});
	describe('When the project this in the third iteration',function(){
		it('then the project should has 1 members', function(){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(2);
		                done();
		            });

		});
		it('And the project has 1 user stories not started', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And the project have 2 user Stories with delivered state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('And the project have 3 user Stories with Accepted state', function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});


	});*/
});