/**
 * This test file is a set of unit test for smoke testing on the account services
 * on Pivotal Tracker
 * @Author: Jorge Avila Baldiviezo
 */
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints.json');
var config = require('../../resources/config.json');
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
 * End point services
 */
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var postProject = endPoints.projects.projectsEndPoint;
var accountsEndPoint = endPoints.accounts.accountsEndPoint;
var accountsByIdEndPoint = endPoints.accounts.accountsByIdEndPoint;
var accountSummariesEndPoint = endPoints.accounts.accountSummariesEndPoint;
var accountMembershipsEndPoint = endPoints.accounts.accountMembershipsEndPoint;
var accountMembershipEndPoint = endPoints.accounts.accountMembershipEndPoint;

/**
 * Test suit with all tests for the account(s) services
 */
describe('Smoke Testing over pivotaltracker Accounts', function() {
    this.timeout(config.timeout);

    before('before method to get the token user credential and create a project to create an account', function(done) {
        tokenAPI
            .getToken(config.userCredential, function(res) {
                token = res.body.api_token;
                uniqueProjectName = chance.string();
                var existAccounts = null;
                generalLib
                    .get(token, accountsEndPoint, function(res) {
                        existAccounts = res.body;
                        if (existAccounts.length == 0) {
                            var prj1 = {
                                name: uniqueProjectName,
                                new_account_name: chance.string()
                            };
                            generalLib
                                .post(prj1, token, projectsEndPoint, function(res) {
                                    projectIdToDelete = res.body.id;
                                    accountIdForTests = res.body.account_id;
                                    tokenAPI.getToken(config.userCredential2, function(res) {
                                        secondUserMembership = res.body.id;
                                        done();
                                    });
                                });
                        } else {
                            accountIdForTests = existAccounts[0].id;
                            tokenAPI.getToken(config.userCredential2, function(res) {
                                secondUserMembership = res.body.id;
                                done();
                            });
                        }
                    });
            });
    });

    after('after method to delete the project and memberships associated to an account', function(done) {
        var endPointDeleteProject = projectByIdEndPoint.replace('{project_id}', projectIdToDelete);
        var projects = null;
        generalLib
            .get(token, endPoints.projects.projectsEndPoint, function(res){
                projects = res.body;
                if(projects.length == 0) {
                    done();
                } else {
                    generalLib.del(token, endPointDeleteProject, function(res) {
                        projectIdToDelete = null
                        done();
                    });
                }
            });
    });

    describe('All methods of the account(s) service', function() {
        it('GET /accounts returns 200', function(done) {
            generalLib
                .get(token, accountsEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('GET /accounts/{accoind_id} returns 200', function(done) {
            var accByIdEndPoint = accountsByIdEndPoint.replace('{account_id}', accountIdForTests);
            generalLib
                .get(token, accByIdEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('GET /account_summaries returns 200', function(done) {
            generalLib
                .get(token, accountSummariesEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('GET /account_summaries?with_permission=project_creation returns 200', function(done) {
            generalLib
                .get(token, accountSummariesEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('GET /accounts/{accountId}/memberships returns 200', function(done) {
            var accMembershipsEndPoint = accountMembershipsEndPoint.replace('{account_id}', accountIdForTests);
            generalLib
                .get(token, accMembershipsEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('POST /accounts/{accountId}/memberships returns 200', function(done) {
            var accMembershipEndPoint = accountMembershipsEndPoint
                .replace('{account_id}', accountIdForTests);
            var arguments = {
                person_id: secondUserMembership
            };
            generalLib
                .post(arguments, token, accMembershipEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('GET /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
            var accMembershipEndPoint = accountMembershipEndPoint
                .replace('{account_id}', accountIdForTests)
                .replace('{person_id}', secondUserMembership);
            generalLib
                .get(token, accMembershipEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('PUT /accounts/{accountId}/memberships/{membershipId} returns 200', function(done) {
            var accMembershipEndPoint = accountMembershipEndPoint
                .replace('{account_id}', accountIdForTests)
                .replace('{person_id}', secondUserMembership);
            var arguments = {
                project_creator: true
            };
            generalLib
                .put(arguments, token, accMembershipEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });

        it('DELETE /accounts/{accountId}/memberships/{membershipId} returns 204', function(done) {
            var accMembershipEndPoint = accountMembershipEndPoint
                .replace('{account_id}', accountIdForTests)
                .replace('{person_id}', secondUserMembership);
            generalLib
                .del(token, accMembershipEndPoint, function(res) {
                    var expectedStatus = 204;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    done();
                });
        });
    });
});