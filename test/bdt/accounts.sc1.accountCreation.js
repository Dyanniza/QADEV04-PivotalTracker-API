/**
 * BDT scenario for creating a new account when not exists
 * for account creation it is necesary create it with a new project
 * @Author Jorge Avila Baldiviezo
 *
 * 	Scenario 1: Create new account when a new projects is being created
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
var accountsByIdEndPoint = endPoints.accounts.accountsByIdEndPoint;

/**
 * Variables to be used
 */
var token = null;
var endPoint = null;
var dinamicValues = {};
var status = config.status;

describe('Scenario 1: Create new account when a new projects is being created', function() {
    this.timeout(config.timeout);
    before('Get Token', function(done) {
        console.log(config.userCredential2);
        tokenAPI
            .getToken(config.userCredential2, function(res) {
                token = res.body.api_token;
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

    context('Given I dont have "Pivotal Tracker" account', function() {
        describe('When a new project is created giving a new account name as parammeter', function() {
            before('Creating a project associated to a new account', function(done) {
                var proj = {
                    name: config.project_name,
                    new_account_name: config.account_name
                };
                endPoint = projectsEndPoint;
                generalLib
                    .post(proj, token, endPoint, function(res) {
                        dinamicValues.account_id = res.body.account_id;
                        dinamicValues.project_id = res.body.id;
                        expect(res.status).to.equal(status.ok);
                        done();
                    });
            });

            it('Then the a new account should be created', function(done) {
                endPoint = accountsByIdEndPoint.replace('{account_id}', dinamicValues.account_id);
                generalLib
                    .get(token, endPoint, function(res) {
                        console.log("dinamic values", dinamicValues);
                        expect(res.status).to.equal(status.ok);
                        expect(res.body.id).to.equal(dinamicValues.account_id);
                        done();
                    });
            });
        });
    });
});