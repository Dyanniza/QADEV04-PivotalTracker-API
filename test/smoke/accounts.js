/**
 * This test file is a set of unit test for smoke testing on the account services
 * on Pivotal Tracker
 * @Author: Jorge Avila Baldiviezo
 */

/**
 * Libraries to be used for the differents tests
 */
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var accountsAPI = require('../../lib/accountsAPI');
var projectsAPI = require('../../lib/projectsAPI');
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../config.json');
var Chance = require('chance');
var chance = new Chance();
/**
 * Variables to be used in the differents tests
 */
var token = null;
var projectIdToDelete = null;
var accountIdForTests = null;
var uniqueProjectName = null;
var secondUserMembership = null;

/**
 * Test suit with all tests for the account(s) services
 */
describe('Smoke Testing over pivotaltracker Accounts', function() {
	this.timeout(config.timeout);

	before('before method to get the token user credential and create a project to create an account', function(done){
		tokenAPI
			.getToken(config.userCredential1, function(res){
				token = res.body.api_token;
				uniqueProjectName = chance.string();
	            var existAccounts = null;
	            accountsAPI
	            	.getAccounts(token, function(res){
	            		existAccounts = res.body;
	            		console.log('######', existAccounts);
	            		if (existAccounts.length == 0) {
	            			var prj1 = {
				                name: uniqueProjectName,
				                new_account_name: chance.string()
				            };
							projectsAPI
								.createProject(prj1, token, function(res){
									projectIdToDelete = res.body.id;
									accountIdForTests = res.body.account_id;
									tokenAPI.getToken(config.userCredential2, function(res){
										secondUserMembership = res.body.id;
										done();
									});
								});
						} else {
							accountIdForTests = existAccounts.body.id;
							done();
						}
	            	});
			});
	});

	after('after method to delete the project and memberships associated to an account', function(done){
		projectsAPI.deleteProject(projectIdToDelete, token, function(res){
			console.log('OLAKEASE', res.body.status);
			projectIdToDelete = null
			done();
		});
	});
	
	describe('All methods of the account(s) service', function() {
		it('GET /accounts returns 200', function(done){
			accountsAPI
				.getAccounts(token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('GET /accounts/{accoind_id} returns 200',function(done) {
			accountsAPI
				.getAccountById(accountIdForTests, token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('GET /account_summaries returns 200', function(done) {
			accountsAPI
				.getAccountSummaries(token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('GET /account_summaries?with_permission=project_creation returns 200', function(done) {
			accountsAPI
				.getAccountSummaries(token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('GET /accounts/{accountId}/memberships returns 200',function(done) {
			accountsAPI
				.getAccountMemberships(accountIdForTests, token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('POST /accounts/{accountId}/memberships returns 200',function(done) {
			var ids = {
				accountId : accountIdForTests,
				personId : secondUserMembership
			};
			accountsAPI
				.createMemberInAccount(ids, token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('GET /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
			var ids = {
				accountId : accountIdForTests,
				personId : secondUserMembership
			};
			accountsAPI
				.getAccountMembership(ids, token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('PUT /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
			var values = {
				accountId : accountIdForTests,
				personId : secondUserMembership,
				project_creator : true
			};
			accountsAPI
				.updateAccountMember(values, token, function(res) {
					var expectedStatus = 200;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});

		it('DELETE /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
			var ids = {
				accountId : accountIdForTests,
				personId : secondUserMembership
			};
			accountsAPI
				.deleteAccountMember(ids, token, function(res) {
					var expectedStatus = 204;
					var actualStatus = res.status;
					expect(expectedStatus).to.equal(actualStatus);
					done();
				});
		});		
	});
});