/**
 * This file has a set of test suits that will test the CRUD in the account(s) service(s)
 */
var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('../../endPoints.json');
var config = require('../../config.json');
var crudConfig = require('../../crudConfig.json');
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
var dinamicValues = {};

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


describe('CRUD', function() {
    this.timeout(config.timeout);

    before('create an account', function(done) {
        tokenAPI
            .getToken(config.userCredential, function(res) {
                token = res.body.api_token;
                uniqueProjectName = chance.string();
                dinamicValues.userId = res.body.id;
                var existAccounts = null;
                generalLib
                    .get(token, accountsEndPoint, function(res) {
                        existAccounts = res.body;
                        if (existAccounts.length == 0) {
                            var prj1 = {
                                name: 'jorgeproject',
                                new_account_name: 'jorgeaccount'
                            };
                            generalLib
                                .post(prj1, token, projectsEndPoint, function(res) {
                                    dinamicValues.id = res.body.account_id;
                                    dinamicValues.name = prj1.new_account_name;
                                    dinamicValues.created_at = res.body.created_at;
                                    dinamicValues.updated_at = res.body.updated_at;
                                    projectIdToDelete = res.body.id;
                                    accountIdForTests = res.body.account_id;

                                    tokenAPI.getToken(config.userCredential2, function(res) {
                                        secondUserMembership = res.body.id;
                                        done();
                                    });
                                });
                        } else {
                            accountIdForTests = existAccounts[0].id;
                            dinamicValues.id = existAccounts[0].id;
                            dinamicValues.name = existAccounts[0].name;
                            dinamicValues.created_at = existAccounts[0].created_at;
                            dinamicValues.updated_at = existAccounts[0].updated_at;
                            accountIdForTests = existAccounts[0].account_id;
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
        generalLib.del(token, endPointDeleteProject, function(res) {
            projectIdToDelete = null
            done();
        });
    });

    describe('GET Methods for accounts', function() {
        it('GET /accounts', function(done) {
            var kind = crudConfig.accounts.get.kind;
            var plan = crudConfig.accounts.get.plan;
            var status = crudConfig.accounts.get.status;
            var createdAt = dinamicValues.created_at;
            var updatedAt = dinamicValues.updated_at;
            var id = dinamicValues.id;
            var name = dinamicValues.name;
            generalLib
                .get(token, accountsEndPoint, function(res) {
                    expect(res.status).to.equal(200);
                    expect(res.body[0].kind).to.equal(kind);
                    expect(res.body[0].plan).to.equal(plan);
                    expect(res.body[0].status).to.equal(status);
                    expect(res.body[0].created_at).to.equal(createdAt);
                    expect(res.body[0].updated_at).to.equal(updatedAt);
                    expect(res.body[0].id).to.equal(id);
                    expect(res.body[0].name).to.equal(name);
                    done();
                });
        });

        it('GET /accounts/{accoind_id} returns 200', function(done) {
            var accByIdEndPoint = accountsByIdEndPoint.replace('{account_id}', dinamicValues.id);
            var kind = crudConfig.accounts.get.kind;
            var plan = crudConfig.accounts.get.plan;
            var status = crudConfig.accounts.get.status;
            var createdAt = dinamicValues.created_at;
            var updatedAt = dinamicValues.updated_at;
            var id = dinamicValues.id;
            var name = dinamicValues.name;
            generalLib
                .get(token, accByIdEndPoint, function(res) {
                    expect(res.status).to.equal(200);
                    expect(res.body.kind).to.equal(kind);
                    expect(res.body.plan).to.equal(plan);
                    expect(res.body.status).to.equal(status);
                    expect(res.body.created_at).to.equal(createdAt);
                    expect(res.body.updated_at).to.equal(updatedAt);
                    expect(res.body.id).to.equal(id);
                    expect(res.body.name).to.equal(name);
                    done();
                });
        });

        it('GET /account_summaries', function(done) {
            var kind = crudConfig.accounts.get.kind_summary;
            var plan = crudConfig.accounts.get.plan;
            var status = crudConfig.accounts.get.status;
            var id = dinamicValues.id;
            var name = dinamicValues.name;
            generalLib
                .get(token, accountSummariesEndPoint, function(res) {
                    expect(res.status).to.equal(200);
                    expect(res.body[0].kind).to.equal(kind);
                    expect(res.body[0].plan).to.equal(plan);
                    expect(res.body[0].status).to.equal(status);
                    expect(res.body[0].id).to.equal(id);
                    expect(res.body[0].name).to.equal(name);
                    done();
                });
        });

        it('GET /accounts/{accountId}/memberships', function(done) {
            var accMembershipsEndPoint = accountMembershipsEndPoint.replace('{account_id}', dinamicValues.id);

            var kind = crudConfig.accounts.get.kind_memberships;
            var id = dinamicValues.userId;
            var name = dinamicValues.name;
            var owner = crudConfig.accounts.get.owner;
            var admin = crudConfig.accounts.get.admin;
            var projectCreator = crudConfig.accounts.get.project_creator;
            var timekeeper = crudConfig.accounts.get.timekeeper;
            var timeEnterer = crudConfig.accounts.get.time_enterer;
            generalLib
                .get(token, accMembershipsEndPoint, function(res) {
                    expect(res.status).to.equal(200);
                    expect(res.body[0].kind).to.equal(kind);
                    expect(res.body[0].id).to.equal(id);
                    expect(res.body[0].owner).to.equal(owner);
                    expect(res.body[0].admin).to.equal(admin);
                    expect(res.body[0].project_creator).to.equal(projectCreator);
                    expect(res.body[0].timekeeper).to.equal(timekeeper);
                    expect(res.body[0].time_enterer).to.equal(timeEnterer);
                    done();
                });
        });

        it('GET /accounts/{accountId}/memberships/{membershipId}', function(done) {
            var accMembershipEndPoint = accountMembershipEndPoint
                .replace('{account_id}', dinamicValues.id)
                .replace('{person_id}', dinamicValues.userId);

            var kind = crudConfig.accounts.get.kind_memberships;
            var id = dinamicValues.userId;
            var accountId = dinamicValues.id;
            var owner = crudConfig.accounts.get.owner;
            var admin = crudConfig.accounts.get.admin;
            var projectCreator = crudConfig.accounts.get.project_creator;
            var timekeeper = crudConfig.accounts.get.timekeeper;
            var timeEnterer = crudConfig.accounts.get.time_enterer;
            var createdAt = dinamicValues.created_at;
            var updatedAt = dinamicValues.updated_at;
            generalLib
                .get(token, accMembershipEndPoint, function(res) {
                    var actualStatus = res.status;
                    expect(res.status).to.equal(200);
                    expect(res.body.kind).to.equal(kind);
                    expect(res.body.id).to.equal(id);
                    expect(res.body.account_id).to.equal(accountId);
                    expect(res.body.owner).to.equal(owner);
                    expect(res.body.admin).to.equal(admin);
                    expect(res.body.project_creator).to.equal(projectCreator);
                    expect(res.body.timekeeper).to.equal(timekeeper);
                    expect(res.body.time_enterer).to.equal(timeEnterer);
                    expect(res.body.created_at).to.equal(createdAt);
                    expect(res.body.updated_at).to.equal(updatedAt);
                    done();
                });
        });
    });

    describe('POST methods for accounts', function() {
        it('POST /accounts/{accountId}/memberships', function(done) {
            var accMembershipEndPoint = accountMembershipsEndPoint
                .replace('{account_id}', dinamicValues.id);

            var kind = crudConfig.accounts.get.kind_memberships;
            var accountId = dinamicValues.id;
            var owner = crudConfig.accounts.get.ownerfalse;
            var admin = crudConfig.accounts.get.admin;
            var projectCreator = crudConfig.accounts.get.project_creator;
            var timekeeper = crudConfig.accounts.get.timekeeperfalse;
            var timeEnterer = crudConfig.accounts.get.time_enterer;
            var arguments = {
                person_id: secondUserMembership
            };
            generalLib
                .post(arguments, token, accMembershipEndPoint, function(res) {
                    var expectedStatus = 200;
                    var actualStatus = res.status;
                    expect(expectedStatus).to.equal(actualStatus);
                    expect(res.body.kind).to.equal(kind);
                    expect(res.body.account_id).to.equal(accountId);
                    expect(res.body.owner).to.equal(owner);
                    expect(res.body.admin).to.equal(admin);
                    expect(res.body.project_creator).to.equal(projectCreator);
                    expect(res.body.timekeeper).to.equal(timekeeper);
                    expect(res.body.time_enterer).to.equal(timeEnterer);
                    accMembershipEndPoint = accountMembershipEndPoint
                        .replace('{account_id}', dinamicValues.id)
                        .replace('{person_id}', secondUserMembership),
                        generalLib
                        .del(token, accMembershipEndPoint, function(res) {
                            done();
                        });
                });
        });
    });
});