/**
 * BDT scenario to grant owner role to another member account
 * @Author Jorge Avila Baldiviezo
 *
 * Scenario: Grant the owner role to another person
	Given I have Pivotal Tracker account
	When I create a new membership with an person id
		Then a new membership should be created in the account with admin property in false
	When the admin role is granted to the new membership
		Then the admin role of the first account membership should continue on false
		And the admin role of the new membership that were modified now is true
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
var accountsEndPoint = endPoints.accounts.accountsEndPoint;
var accountMembershipsEndPoint = endPoints.accounts.accountMembershipsEndPoint;
var accountMembershipEndPoint = endPoints.accounts.accountMembershipEndPoint;
/**
 * Variables to be used
 */
var token = null;
var endPoint = null;
var dinamicValues = {};
var status = config.status;

describe('Scenario 2: Grant the owner role to another person', function() {
    this.timeout(config.timeout);
    before('Get Token', function(done) {
        tokenAPI
            .getToken(config.userCredential, function(res) {
                token = res.body.api_token;
                dinamicValues.first_userId = res.body.id;
                done();
            });
    });

    context('Given I have Pivotal Tracker account', function() {
        before('create an account', function(done) {
            var existAccounts = null;
            generalLib
                .get(token, accountsEndPoint, function(res) {
                    existAccounts = res.body;
                    if (existAccounts.length == 0) {
                        var prj1 = {
                            name: config.account_name,
                            new_account_name: config.project_name
                        };
                        generalLib
                            .post(prj1, token, projectsEndPoint, function(res) {
                                dinamicValues.id = res.body.account_id;
                                tokenAPI.getToken(config.userCredential2, function(res) {
                                    dinamicValues.second_userId = res.body.id;
                                    done();
                                });
                            });
                    } else {
                        dinamicValues.id = existAccounts[0].id;
                        tokenAPI
                            .getToken(config.userCredential2, function(res) {
                                dinamicValues.second_userId = res.body.id;
                                done();
                            });
                    }
                });
        });

        describe('When I create a new membership with an person id', function() {
            before('create new membership in the account', function(done) {
                endPoint = accountMembershipsEndPoint.replace('{account_id}', dinamicValues.id);
                var newMembership = {
                    person_id: dinamicValues.second_userId
                };
                generalLib
                    .post(newMembership, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        done();
                    });
            });

            it('Then a new membership should be created in the account with admin property in false', function(done) {
                endPoint = accountMembershipEndPoint
		                    .replace('{account_id}', dinamicValues.id)
		                    .replace('{person_id}', dinamicValues.second_userId);
                generalLib
                    .get(token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.admin).to.equal(false);
                        done();
                    });
            });
        });

        describe('When the admin role is granted to the new membership', function() {
            before('granting owner role to the new membership in the account', function(done) {
                endPoint = accountMembershipEndPoint
		                    .replace('{account_id}', dinamicValues.id)
		                    .replace('{person_id}', dinamicValues.second_userId);
                var grantRole = {
                    admin: true
                };
                generalLib
                    .put(grantRole, token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        done();
                    });
            });

            after('Delete the membership added in the account', function(done) {
                endPoint = accountMembershipEndPoint
		                    .replace('{account_id}', dinamicValues.id)
		                    .replace('{person_id}', dinamicValues.second_userId);
                generalLib
                    .del(token, endPoint, function(res) {
                        expect(res.status).to.equal(status.noContent);
                        done();
                    });
            });

            it('Then the admin role of the first account membership should continue on false', function(done) {
                endPoint = accountMembershipEndPoint
		                    .replace('{account_id}', dinamicValues.id)
		                    .replace('{person_id}', dinamicValues.first_userId);
                generalLib
                    .get(token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.admin).to.equal(false);
                        done();
                    })
            });

            it('And the admin role of the new membership that were modified now is true', function(done) {
                endPoint = accountMembershipEndPoint
		                    .replace('{account_id}', dinamicValues.id)
		                    .replace('{person_id}', dinamicValues.second_userId);
                generalLib
                    .get(token, endPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.admin).to.equal(true);
                        done();
                    })
            });
        });
    });
});