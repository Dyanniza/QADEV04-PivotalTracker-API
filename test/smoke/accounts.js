/**
 * This test file is a set of unit test for smoke testing on the account services
 * on Pivotal Tracker
 * @Author: Jorge Avila Baldiviezo
 */
var request = require('superagent');
require('superagent-proxy')(request);

var expect = require('chai').expect;
var accountsAPI = require('../../lib/accountsAPI');
// var accountIds = require('../../utils/accountIds');
// var personIds = require('../../utils/personIds');
var projectsAPI = require('../../lib/projectsAPI');
var tokenAPI = require('../../lib/tokenAPI');
var config = require('../../config.json');
var Chance = require('chance');
var chance = new Chance();
var token = null;
var projectIdToDelete = null;
var accountIds = [];

/**
 * [description]
 * @param  {Object} ) {	this.timeout(10000);	var userTokenCredential [description]
 * @return {[type]}   [description]
 */
describe('Smoke Testing over pivotaltracker Accounts', function() {
	before('before method to get the token user credential', function(done){
		tokenAPI
			.getToken(config.userCredential1, function(res){
				token = res.body.api_token;
				
				var prj1 = {
	                name: chance.string(),
	                new_account_name: chance.string
	            };
				projectsAPI
					.createProject(prj1, token, function(res){
						projectIdToDelete = res.body.id;
						accountIds.push(res.body.accountId);
						done();
					});
				
			});
	});
	
	describe('All methods of the account(s) service', function(){
		it('GET /accounts returns 200',function(done){
		accountsAPI
			.getAccounts(token, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				done();
			});
		});

		// it('GET /accounts/{accoind_id} returns 200',function(done) {
		// 	accountsAPI
		// 		.getAccountById(accountIds.account1, token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
				
		// });

		// it('GET /account_summaries returns 200', function(done) {
		// 	accountsAPI
		// 		.getAccountSummaries(token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it('GET /account_summaries?with_permission=project_creation returns 200', function(done) {
		// 	accountsAPI
		// 		.getAccountSummaries(token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it('GET /accounts/{accountId}/memberships returns 200',function(done) {
		// 	accountsAPI
		// 		.getAccountMemberships(accountIds.account1, token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it('POST /accounts/{accountId}/memberships returns 200',function(done) {
		// 	var ids = {
		// 		accountId : accountIds.account1,
		// 		personId : personIds.person2
		// 	};
		// 	accountsAPI
		// 		.createMemberInAccount(ids, token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it('GET /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		// 	var ids = {
		// 		accountId : accountIds.account1,
		// 		personId : personIds.person1
		// 	};
		// 	accountsAPI
		// 		.getAccountMembership(ids, token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it('PUT /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		// 	var values = {
		// 		accountId : accountIds.account1,
		// 		personId : personIds.person2,
		// 		project_creator : true
		// 	};
		// 	accountsAPI
		// 		.updateAccountMember(values, token, function(res) {
		// 			var expectedStatus = 200;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });

		// it.only('DELETE /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		// 	var values = {
		// 		accountId : accountIds.account1,
		// 		personId : personIds.person2
		// 	};
		// 	accountsAPI
		// 		.deleteAccountMember(values, token, function(res) {
		// 			var expectedStatus = 204;
		// 			var actualStatus = res.status;
		// 			expect(expectedStatus).to.equal(actualStatus);
		// 			done();
		// 		});
		// });		
	});
});