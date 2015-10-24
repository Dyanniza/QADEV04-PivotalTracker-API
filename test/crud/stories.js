/*
@author Jhasmany Quiroz
@Class STORIES for Test Cases the Services of 'Stories'.
 */
var expect =  require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var Chance = require('chance');

var config = require('../../resources/config');
var stories = require('../../lib/generalLib');
var getToken = require('../../lib/tokenAPI');
var endPoints = require('../../resources/endPoints');
var crudConfig = require('../../resources/crudConfig');

 /**
 * End point services
 */
var storiesEndPoint = endPoints.stories.storiesEndPoint;

/**
 * Variables to be used in the differents tests
 */
var token = null;
var id = null;
var argument = crudConfig.stories.get;
var userCredential = config.userCredential;
var status = config.status;
var chance = new Chance();

describe('CRUD Test for Stories Service Pivotal Tracker', function(){
	this.timeout(config.timeout);
	crudConfig = crudConfig.stories;
	before('Getting Token.....', function (done) {
    	getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                var newProject = {
                    name: chance.string()
                };
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                stories
                    .post(newProject, token.api_token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        newProject.project_id = res.body.id;
                        done();
                    });                                
            });
    });

    describe('HTTP METHODS for Stories Service', function (){
        it('POST /projects/{project_id}/stories', function (done) {
            storiesEndPoint = storiesEndPoint.replace('{project_id}', newProject.project_id);
            stories
                .post(argument, token, storiesEndPoint, function (res){
                    expect(res.status).to.equal(status.ok);
                    
                });
        });
    	it('GET /projects/{project_id}/stories', function (done) {
    		storiesEndPoint = storiesEndPoint.replace('{project_id}', crudConfig.get);
    		stories
    			.get(token, storiesEndPoint, function(res){
    				//expect
    			});
    	});
    });
});