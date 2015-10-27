/*
Scenary 2
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

describe('Scenary 2',function(){

	context('Given I have a Project empty',function(){

		it('Then 2 project memberships should add under project ', function(){
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
		it('And 6 user stories should be created under project', function(){
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
	});
	describe('When the project this in the fisrt iteration',function(){
		it('then the project has 3 members', function(){
			var endPointMember = endPoint.projectMembership.prjMembership.replace('{project_id}', projectId);
				console.log(endPointMember);
		        servicesAPI
		            .get(token.api_token, endPointMember, function(res) {
		                expect(res.status).to.equal(status.ok);
		                done();
		            });

		});
		it('then two user stories should be assigned to every member', function(){

		});
		it('And one user story should be finished for every member', function(){

		});
		it('And all user stories finished should pass to Delivered state', function(){

		});
		it('And one member should remove to project', function(){

		});
	});
	describe('When the project this in the second iteration',function(){
		it('then the project should has 2 members', function(){

		});
		it('And the project has 3 user stories not started', function(){

		});
		it('And the project have 3 user Stories with delivered state', function(){

		});
		it('then one user story should be finished for every member', function(){

		});
		it('And all user stories finished should pass to Delivered state', function(){

		});
		it('And all user stories Delivered should pass to Accepted state', function(){

		});
		it('And one member should remove to project', function(){

		});
	});
	describe('When the project this in the third iteration',function(){
		it('then the project should has 1 members', function(){

		});
		it('And the project has 1 user stories not started', function(){

		});
		it('And the project have 2 user Stories with delivered state', function(){

		});
		it('And the project have 3 user Stories with Accepted state', function(){

		});


	});
});