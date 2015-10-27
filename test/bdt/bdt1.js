/*
Scenario 1:
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


describe('Scenario 1',function () {
	this.timeout(config.timeout);
	//this.timeout(100000);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = null;
	var iterationEndPoint = null;
    var prjByIdEndPoint = null;
    var chance = new Chance();
	/*var accountMS = [{email: "Jhasmany.Quiroz@fundacion-jala.org", role: "member"},
					{email: "jorge_top14@gmail.com", role: "member"}];	*/

    before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });
    before('Create Project',function(done){
	prjByIdEndPoint = endPoint.projects.projectsEndPoint;
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
		delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
	    servicesAPI
	        .del(token.api_token, delEndPoint, function(res) {
	            expect(res.status).to.equal(status.noContent);
	            done();
	        });
	});
 

	context('Given I have a Project empty',function(){
		for (var i = 0; i < 5; i++) {
			it('And 10 user stories are created under project',function(done){
				var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
				var story = {
				    name: chance.string()
				};			      
				servicesAPI
				    .post(story, token.api_token, storyEndPoint, function(res) {
						expect(res.code).to.equal(config.codeStories);
						done();	
					});
			});
		};

		//for (var i = 0; i < 2; i++) {
						
							
		        
		        //var argument=accountMS[i];
			it('And 2 project’s membership are added under project', function(done) {
		        var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
		        /*var argument = {
		            email: crudConfig.projectMembership.account.email,
		            role: crudConfig.projectMembership.account.role
		        };*/
		        var argument = {
		            email: 'Jhasmany.Quiroz@fundacion-jala.org',
		            role: 'member'
		        };
		        
		        console.log(argument);
		        servicesAPI
		            .post(argument, token.api_token, prjMSEndPoint, function(projectMS) {
		                expect(projectMS.status).to.equal(status.ok);

		                console.log('And 2 project’s membership are added under project');
		                done();
		            });
		    });
			
		//};
	});
	describe('When the project this in the first iteration',function(){
		console.log(projectId);
		
			it('Then the project should have 10 user stories not started',function(done){
				var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
				servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    expect(res.body.length).to.equal(5);
                    for (var i = 0; i <5; i++) {
                    	
                    };
                    done();                    
                });

			});
			it('And the project should have 3 members',function(done){
				var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                done();
		            });
			});
			it('And two user stories should pass the finished state',function(done){
				var storiesEndPoint = endPoint.projects.projectsEndPoint;
				servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();                    
                });
			});
		});
		describe('When the project pass to the second iteration',function(){

			
			it('Then the project should have eight user stories not started',function(done){
				console.log(projectId);
				var storiesEndPoint = endPoint.projects.projectsEndPoint;
				servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();                    
                });

			});
			it('And the project should have 3 members',function(done){
				var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		            	console.log(res.body);
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(2);
		                done();
		            });

			});
			it('And other two user stories should pass the finished state',function(done){
				var storiesEndPoint = endPoint.projects.projectsEndPoint;
				servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();                    
                });

			});
			it('And all user stories finished should pass to delivered state',function(done){
				var storiesEndPoint = endPoint.projects.projectsEndPoint;
				servicesAPI
                .get(token.api_token, storiesEndPoint, function(res) {
                    expect(res.status).to.equal(status.ok);
                    done();                    
                });

			});
		});
});