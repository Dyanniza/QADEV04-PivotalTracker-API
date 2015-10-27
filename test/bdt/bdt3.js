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


describe('Scenary 3',function(){
	context('Given I have a 2 empty Project: "projectA" and "projectB"',function(){
		it('Then I add 3 member to me account',function(){

		});
		describe('when I have only 3 member dispensable for assigned to projects',function(){
			it('Then 1 project memberships should add under "projectA"',function(){

			});
			it('And 2 project memberships should add under "projectB"',function(){

			});
		});
		describe('when I have members added in the projects "projectA" and "projectB"',function(){
			it('then 4 user stories it should be create in "projectA"',function(){

			});
			it('and 6 user stories it should be create in "projectB"',function(){

			});
		});
		describe('when I have user stories created in the projects "projectA" and "projectB"',function(){
			it('Then 1 user story for member it should be assigned in the "projectA"',function(){

			});
			it('and 2 user story for member it should be assigned in the "projectB"',function(){

			});
		});

	});
	describe('When the project started in the fisth iteration',function(){
		it('Then the "projectA" should be have  2 memberships',function(){

		});
		it('and the "projectB" should be have 3 memberships',function(){

		});
		it('and  the "projectA" should be have 2 user stories assigned',function(){

		});
		it('and  the "projectA" should be have 2 user stories Noassigned',function(){

		});
		it('and the "projectB" should be have 6 user stories assiged',function(){

		});

	});

});