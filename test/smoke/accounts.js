/**
 * This test file is a set of unit test for smoke testing on the account services
 * on Pivotal Tracker
 * @Author: Jorge Avila Baldiviezo
 */
var request = require('superagent');
require('superagent-proxy')(request);

var expect = require('chai').expect;
var tokenAPI = require('../lib/tokenAPI');
var accountsAPI = require('../lib/accountsAPI');
var accountIds = require('../utils/accountIds');
var personIds = require('../utils/personIds');

describe('Smoke Testing over pivotaltracker Accounts', function() {
	this.timeout(10000);
	var userTokenCredential = {
		tokenName:'X-TrackerToken',
		tokenString:'d9fed77e81264e0adf2d202bb2e908be'
	};
	
	it('GET /accounts returns 200',function(done){
		accountsAPI
			.getAccounts(userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
			
	});

	it('GET /accounts/{accoind_id} returns 200',function(done) {
		accountsAPI
			.getAccountById(accountIds.account1, userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
			
	});

	it('GET /account_summaries returns 200', function(done) {
		accountsAPI
			.getAccountSummaries(userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('GET /account_summaries?with_permission=project_creation returns 200', function(done) {
		accountsAPI
			.getAccountSummaries(userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('GET /accounts/{accountId}/memberships returns 200',function(done) {
		accountsAPI
			.getAccountMemberships(accountIds.account1, userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('POST /accounts/{accountId}/memberships returns 200',function(done) {
		var ids = {
			accountId : accountIds.account2,
			personId : personIds.person2
		};
		accountsAPI
			.createMemberInAccount(ids, userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('GET /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		var ids = {
			accountId : accountIds.account1,
			personId : personIds.person1
		};
		accountsAPI
			.getAccountMembership(ids, userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('PUT /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		var values = {
			accountId : accountIds.account2,
			personId : personIds.person2,
			project_creator : true
		};
		accountsAPI
			.updateAccountMember(values, userTokenCredential, function(res) {
				var expectedStatus = 200;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});

	it('DELETE /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
		var values = {
			accountId : accountIds.account1,
			personId : personIds.person2
		};
		accountsAPI
			.deleteAccountMember(values, userTokenCredential, function(res) {
				var expectedStatus = 204;
				var actualStatus = res.status;
				expect(expectedStatus).to.equal(actualStatus);
				//many other assertions
				done();
			});
	});
});