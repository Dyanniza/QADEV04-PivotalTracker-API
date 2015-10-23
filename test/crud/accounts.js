/**
 * This file has a set of test suits that will test the CRUD in the account(s) service(s)
 */

var request = require('superagent');
require('superagent-proxy')(request);
var expect = require('chai').expect;
var generalLib = require('../../lib/generalLib');
var tokenAPI = require('../../lib/tokenAPI');
var endPoints = require('..\\..\\endPoints.json');
var config = require('..\\..\\config.json');
var crudConfig = require('..\\..\\crudConfig.json');
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


describe('CRUD', function(){
	before('create an account', function(){
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
        generalLib.del(token, endPointDeleteProject, function(res) {
            projectIdToDelete = null
            done();
        });
    });

	describe('GET /', function(){
		it('GET /accounts', function(done){
			generalLib
				.get(token, accountsEndPoint, function(){
			});
		});
	});
});