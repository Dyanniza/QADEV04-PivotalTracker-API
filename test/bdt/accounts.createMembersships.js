/**
 * BDT for scenario for creating a new account when not exists
 * @Author Jorge Avila Baldiviezo
 *
 * 	Story: The user story is accepted and pass to the done dashboard when the iteration is finished  
 * 	Story: Create new account when a new projects is being created
	Given I dont't have Pivotal Tracker accounts
	When a new project is created giving a new account name as parammeter
	Then the a new account should be created
		And the project should be associated to this account
 */

var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints.json');
var config = require('../../resources/config.json');

/**
 * Endpoints
 */
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var postProject = endPoints.projects.projectsEndPoint;
var accountsEndPoint = endPoints.accounts.accountsEndPoint;
var accountsByIdEndPoint = endPoints.accounts.accountsByIdEndPoint;
var accountSummariesEndPoint = endPoints.accounts.accountSummariesEndPoint;
var accountMembershipsEndPoint = endPoints.accounts.accountMembershipsEndPoint;
var accountMembershipEndPoint = endPoints.accounts.accountMembershipEndPoint;

var token = null;
var endPoint = null;
var dinamicValues = {};
var status = config.status;

describe('Create a new Account', function() {
	this.timeout(config.timeout);

	before('Get Token', function(done) {
		console.log(token, '#@###########');
		tokenAPI
			.getToken(config.userCredential, function(res) {
				token = res.body.api_token;
				console.log(token, '#@###########');
				done();
			});
	});

	after('delete project', function(done) {
		endPoint = projectByIdEndPoint.replace('{project_id}', dinamicValues.project_id);
		generalLib
			.del(token, endPoint, function(res) {
				expect(res.status).to.equal(status.noContent);
				done();
			});
	});

	describe('Given I dont have "Pivotal Tracker" account', function() {
		it('When a new project is created giving a new account name as parammeter', function(done) {
			var proj = {
				name: config.project_name,
				new_account_name: config.account_name 
			};

			console.log("$$$%#############",proj);
			endPoint = projectsEndPoint;
			console.log("$$$%#############",endPoint);
			generalLib
				.post(proj, token, endPoint, function(res) {
					dinamicValues.account_id = res.account_id;
					dinamicValues.project_id = res.id;
					expect(res.status).to.equal(status.ok);
					done();
				});
		});

		it('Then the a new account should be created', function(done) {
			endPoint = accountsByIdEndPoint.replace('{account_id}', dinamicValues.account_id);
			console.log(endPoint, "QQQQQQQQQ");
			generalLib
				.del(token, endPoint, function(res) {
					console.log("dinamic values", dinamicValues);
					expect(res.status).to.equal(status.ok);
					expect(res.body.id).to.equal(dinamicValues.account_id);
					done();
				});
		});
	});
});