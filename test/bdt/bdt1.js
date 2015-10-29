/*
Scenario 1: Information correct is displayed stories when the project pass the iterations
Given I have a Project empty
	And 10 user stories are created under project
	And 2 project’s membership are added under project
When the project this in the first iteration
	Then the project should have 10 user stories not started 
	And the project should have 3 members
	And two user stories should pass the finished state
When the project pass to the second iteration
	Then the project should have eight user stories not started
	And the project should have 3 members
	And other two user stories should pass the finished state
	And all user stories finished should pass to delivered state
When the project pass to the third iteration
	Then the project should have 6 user stories not started
	And the project should have 3 members
	And all user stories delivered should be accepted
	And other two user stories should pass the finished state
	And a new member its should add on project
When the project pass to fourth iteration
	Then the project should have 4 user stories not started
	And the project should have 4 user stories with accepted state
	And the project should have 2 user stories with accepted state
	And the project should have 4 members
-------And all actions on the project it should be displayed in the project History
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
var scenario = require('../../resources/scenario.json');

describe('Scenario 1',function () {
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;
	var iterationEndPoint = null;
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
	context('Given I have a Project whit 5 user stories',function(){
		var story = [{name: 'argument1'}, {name: 'argument2'}, {name: 'argument3'}];
		var members = [{email: 'Jhasmany.Quiroz@fundacion-jala.org', role: 'member'},
					   {email: 'jorge.avila@fundacion-jala.org', role: 'member'}];
		it.each(story,'Then 5 user stories are created under project', ['argument'],function(element,done){
			var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
			    .post(element, token.api_token, storyEndPoint, function(res) {
					expect(res.status).to.equal(status.ok);
					IDstories.push(res.body.id);
					done();	
				});
		});		

		it.each(members,'then 2 project’s membership is added under project', function(element, done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
		    servicesAPI
		        .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            done();
		        });
		});
			
	});
	describe('When the project started',function(){
		var current=scenario.scenario1.current;

		it('Then the projects iteration should be 1',function(done){
			var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

	        servicesAPI
	            .get(token.api_token, iterationEndPoint, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(1);
	                done();
	            });

		});

		
		it('And the project should have 3 user stories unscheduled',function(done){
			var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
                .get(token.api_token, storiesEndPoint+'?with_state=unscheduled', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
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
	
		it.each(IDstories,'And 3 user stories should pass the finished state',function(IDstories,done){
			var storyEndPoint = endPoint.story.storyEndPoint.replace('{project_id}', projectId)
															.replace('{story_id}', IDstories);
	        servicesAPI
	            .put(current, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });
		});
	});
	describe('When the project pass to the second iteration',function(){
		before('pass to second iteration', function(done) {
	        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
	            .replace('{iteration_number}', 1);
	        servicesAPI
	            .put({"length":0}, token.api_token, iterationEndPoint, function(iteration) {
	                expect(iteration.status).to.equal(status.ok);
	                done();
	            });
	    });
		it('Then the projects iteration should be 2',function(done){
			var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

	        servicesAPI
	            .get(token.api_token, iterationEndPoint, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(2);
	                done();
	            });

		});
		it('And the project should have 0 user stories unscheduled',function(done){
			var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
                .get(token.api_token, storiesEndPoint+'?with_state=unscheduled', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(0);
                    done();                    
                });
			});
		it('And the project should have 3 user stories finished',function(done){
			var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
                .get(token.api_token, storiesEndPoint+'?with_state=finished', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();                    
                });
			});
		it('And the project should have 2 members',function(done){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
	        servicesAPI
	            .get(token.api_token, endPointMember, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(3);
	                done();
	            });
	    });
	    var story2 = [{name: 'argument4'}, {name: 'argument5'}];

		it.each(story2,'And other two user stories should be add in the project', ['argument'],function(element,done){
			var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
			    .post(element, token.api_token, storyEndPoint, function(res) {
					expect(res.status).to.equal(status.ok);
//					IDstories.push(res.body.id);
					done();	
				});
		});	

		
	});
	describe('When the project pass to the second iteration',function(){
		before('pass to second iteration', function(done) {
	        var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint2.replace('{project_id}', projectId)
	            .replace('{iteration_number}', 2);
	        servicesAPI
	            .put({"length":0}, token.api_token, iterationEndPoint, function(iteration) {
	                expect(iteration.status).to.equal(status.ok);
	                done();
	            });
	    });
		it('Then the projects iteration should be 2',function(done){
			var iterationEndPoint = endPoint.iteration.iterationtokenEndPoint.replace('{project_id}', projectId);

	        servicesAPI
	            .get(token.api_token, iterationEndPoint, function(res) {
	                expect(res.status).to.equal(status.ok);
	                expect(res.body.length).to.equal(3);
	                done();
	            });

		});
		it('And the project should have 2 user stories unscheduled',function(done){
			var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
                .get(token.api_token, storiesEndPoint+'?with_state=unscheduled', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(2);
                    done();                    
                });
			});
		it('And the project should have 3 user stories finished',function(done){
			var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
			servicesAPI
                .get(token.api_token, storiesEndPoint+'?with_state=finished', function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(3);
                    done();                    
                });
			});
	});
});