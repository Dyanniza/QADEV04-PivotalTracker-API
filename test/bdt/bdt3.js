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
require('it-each')();

describe('Scenary 3',function(){
	this.timeout(config.timeout);
	var userCredential = config.userCredential;
	var token = null;
	var projectId = [];
	var iterationEndPoint = null;
    var chance = new Chance();
    var IDstories=[];
    var idMembersPA=[];
    var idMembersPB=[];
	before('Getting the token', function(done) {
        tokenAPI
            .getToken(userCredential, function(res) {
                token = res.body;
                expect(token.username).to.equal(userCredential.userAccount);
                done();
            });
    });
    after('Delete the project', function(done){
		var delEndPoint1 = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId[0]);
		var delEndPoint2 = endPoint.projects.projectByIdEndPoint.replace('{project_id}', projectId[1]);
	    servicesAPI
	        .del(token.api_token, delEndPoint1, function(res) {
	            expect(res.status).to.equal(status.noContent);
	            servicesAPI
	        	.del(token.api_token, delEndPoint2, function(res) {
	            	expect(res.status).to.equal(status.noContent);
	            	done();
	            });
	        });
	});
	var projects=[{name:'z'},{name: 'zz'}];

    it.each(projects, 'Create Project',function(projects, done){
		var prjByIdEndPoint = endPoint.projects.projectsEndPoint;
		    servicesAPI
		        .post(projects, token.api_token, prjByIdEndPoint, function(res) {
		            projectId.push(res.body.id);
		            expect(res.status).to.equal(status.ok);
		            done();
		        });
	});

	
	context('Given I have a 2 empty Project: "projectA" and "projectB"',function(){
		var membersPA = [{email: 'Jhasmany.Quiroz@fundacion-jala.org', role: 'member'},
					   {email: 'jorge.avila@fundacion-jala.org', role: 'member'},
					   ];
		var membersPB = [{email: 'Jhasmany.Quiroz@fundacion-jala.org', role: 'member'},
					   {email: 'jorge.avila@fundacion-jala.org', role: 'member'},
					   ];
		
		it('Then I have a account with 2 projects',function(done){
			var meEndPoint=endPoint.me.meEndPoint;
			servicesAPI
				.get(token.api_token, meEndPoint,function(res){
					expect(res.status).to.equal(status.ok);
					expect(res.body.projects.length).to.equal(82);
				})

		});

		it.each(membersPA,'Then I add 2 member in projectA', function(element, done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[0]);
		    servicesAPI
		        .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            idMembersPA.push(projectMS.body.id);
		            done();
		        });
		});
		it.each(membersPB,'And I add 2 member in projectB', function(element, done) {
		    var prjMSEndPoint = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[1]);
		    servicesAPI
		        .post(element, token.api_token, prjMSEndPoint, function(projectMS) {
		            expect(projectMS.status).to.equal(status.ok);
		            idMembersPB.push(projectMS.body.id);
		            done();
		        });
		});

		describe('when I have member added in ProjectA and ProjectB',function(){
			var uStoryA = [{name: 'storyA1'}, {name: 'storyA2'}, {name: 'storyA3'},{name: 'storyA4'}];
			var uStoryB = [{name: 'storyB1'}, {name: 'storyB2'}, {name: 'storyB3'}];
			it.each(uStoryA,'Then 4 user stories should be created under projectA',function(element,done){
				var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[0]);
				servicesAPI
				    .post(element, token.api_token, storyEndPoint, function(res) {
						expect(res.status).to.equal(status.ok);
						IDstories.push(res.body.id);
						done();	
					});
			});
			it.each(uStoryB,'And 3 user stories should be created under projectB',function(element,done){
				var storyEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[1]);
				servicesAPI
				    .post(element, token.api_token, storyEndPoint, function(res) {
						expect(res.status).to.equal(status.ok);
						IDstories.push(res.body.id);
						done();	
					});
			});
		});
		describe('when I have user stories created in the projects "projectA" and "projectB"',function(){
			it('Then the projectA should have 3 members',function(done){
				var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[0]);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(3);
		                done();
		            });
		    });
		    it('And the projectA should have 3 members',function(done){
				var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId[1]);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                expect(res.body.length).to.equal(3);
		                done();
		            });
		    });
			it('And the projectA should have 4 user stories',function(done){
				var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[0]);
				servicesAPI
	                .get(token.api_token, storiesEndPoint, function(res) {
	                    expect(res.status).to.equal(status.ok);
	                    expect(res.body.length).to.equal(4);
	                    done();                    
	                });
			});
			it('And the projectB should have 3 user stories',function(done){
				var storiesEndPoint = endPoint.stories.storiesEndPoint.replace('{project_id}', projectId[1]);
				servicesAPI
	                .get(token.api_token, storiesEndPoint, function(res) {
	                    expect(res.status).to.equal(status.ok);
	                    expect(res.body.length).to.equal(3);
	                    done();                    
	                });
			});
		});
		
		
	});
});