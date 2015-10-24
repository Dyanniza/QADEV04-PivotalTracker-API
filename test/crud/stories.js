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
var tokenAPI = require('../../lib/tokenAPI');
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
var argument = configLog.stories.get;
var userCredential = config.userCredential;
var status = config.status;

describe('CRUD Test for Stories Service Pivotal Tracker', function(){
	this.timeout(config.timeout);
	crudConfig = crudConfig.stories;
	before('Getting Token.....', function (done) {
    	getToken
            .getToken(userCredential, function (res) {
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;
                done();                
            });
    });

    describe('HTTP METHODS for Stories Service', function(){
    	it('GET /projects/{project_id}/stories', function (done) {
    		storiesEndPoint = storiesEndPoint.replace('{project_id}', crudConfig.get);
    		stories
    			.get(token, storiesEndPoint, function(res){
    				//expect
    			});
    	});
    });
});