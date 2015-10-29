/*
Scenary 3
Given I have a 2 empty Project: "projectA" and "projectB"
	Then I add 3 member to me account
	when I have only 3 member dispensable for assigned to projects
		Then 1 project memberships should add under "projectA"
		And 2 project memberships should add under "projectB"

	when I have members added in the projects "projectA" and "projectB"
		then 4 user stories it should be create in "projectA"
		and 6 user stories it should be create in "projectB"
	when I have user stories created in the projects "projectA" and "projectB"
		Then 1 user story for member it should be assigned in the "projectA"
		and 2 user story for member it should be assigned in the "projectB"
When the project started in the fisth iteration
	Then the "projectA" should be have  2 memberships
	and the "projectB" should be have 3 memberships
	and  the "projectA" should be have 2 user stories assigned
	and  the "projectA" should be have 2 user stories Noassigned
	and the "projectB" should be have 6 user stories assiged

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

describe('Scenary 3',function(){
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
    after('Delete the project', function(done){
		var delEndPoint = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId);
	    servicesAPI
	        .del(token.api_token, delEndPoint, function(res) {
	            expect(res.status).to.equal(status.noContent);
	            done();
	        });
	});
	var projects=[{name:'projectA'},{name: 'projectB'}];

    before.each(projects, 'Create Project',function(projects, done){
		var prjByIdEndPoint = endPoint.projects.projectsEndPoint;
		    servicesAPI
		        .post(projects, token.api_token, prjByIdEndPoint, function(res) {
		            projectId = res.body.id;
		            expect(res.status).to.equal(status.ok);
		            done();
		        });
	});

	
	context('Given I have a 2 empty Project: "projectA" and "projectB"',function(){
		it.only('Then I have a account with 2 projects',function(done){
			var meEndPoint=endPoint.me;
			servicesAPI
				.get(token.api_token, meEndPoint,function(res){
					expect(res.status).to.equal(status.ok);
					expect(res.body.projects).to.equal(2);
				})

		});
	});
});




		it('Then I add 3 member to me account',function(){
			var accMembershipEndPoint = accountMembershipsEndPoint
                .replace('{account_id}', accountIdForTests);
            var arguments = {
                person_id: secondUserMembership
            };
            generalLib
                .post(arguments, token, accMembershipEndPoint, function(res) {
                    var expectedStatus = status.ok;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });


		});
		describe('when I have only 3 member dispensable for assigned to projects',function(){
			it('Then 1 project memberships should add under "projectA"',function(){
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

			});
			it('And 2 project memberships should add under "projectB"',function(){
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

			});
		});
		describe('when I have members added in the projects "projectA" and "projectB"',function(){
			it('then 4 user stories it should be create in "projectA"',function(){
				for (var i = 0; i <6; i++) {
					var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
					var story = {
					    name: chance.string()
					};			      
					servicesAPI
					    .post(story, token.api_token, storyEndPoint, function(res) {
							expect(res.code).to.equal(config.codeStories);
							done();	
						});
				};


			});
			it('and 6 user stories it should be create in "projectB"',function(){
				for (var i = 0; i <6; i++) {
					var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId);
					var story = {
					    name: chance.string()
					};			      
					servicesAPI
					    .post(story, token.api_token, storyEndPoint, function(res) {
							expect(res.code).to.equal(config.codeStories);
							done();	
						});
				};


			});
		});
		describe('when I have user stories created in the projects "projectA" and "projectB"',function(){
			it('Then 1 user story for member it should be assigned in the "projectA"',function(){
				var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
		        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
		        story.name = chance.string();
		        generalLib
		            .put(story, token.api_token, storyEndPoint, function(res) {
		                expect(res.status).to.equal(config.status.ok);
		                done();
		            });

			});
			it('and 2 user story for member it should be assigned in the "projectB"',function(){
				var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
		        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
		        story.name = chance.string();
		        generalLib
		            .put(story, token.api_token, storyEndPoint, function(res) {
		                expect(res.status).to.equal(config.status.ok);
		                done();
		            });

			});
		});

	});
	describe('When the project started in the fisth iteration',function(){
		it('Then the "projectA" should be have  2 memberships',function(){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(2);
		                done();
		            });
		});
		it('and the "projectB" should be have 3 memberships',function(){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(2);
		                done();
		            });
		});
		it('and  the "projectA" should be have 2 user stories assigned',function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('and  the "projectA" should be have 2 user stories Noassigned',function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});
		it('and the "projectB" should be have 6 user stories assiged',function(){
			var storyEndPoint = endPoints.story.storyEndPoint.replace('{project_id}', prj.id);
	        storyEndPoint = storyEndPoint.replace('{story_id}', story.id);
	        story.name = chance.string();
	        generalLib
	            .put(story, token.api_token, storyEndPoint, function(res) {
	                expect(res.status).to.equal(config.status.ok);
	                done();
	            });

		});

	});

});