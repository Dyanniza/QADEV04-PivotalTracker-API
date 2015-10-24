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
var argument = crudConfig.stories.post;
var userCredential = config.userCredential;
var status = config.status;
var chance = new Chance();

describe('CRUD Test for Stories Service Pivotal Tracker', function(){
	this.timeout(config.timeout);
	crudConfig = crudConfig.stories;
    var newProject = {
        name: chance.string()
    };
	before('Getting Token.....', function (done) {
    	getToken
            .getToken(userCredential, function (res) {                
                expect(res.status).to.equal(status.ok);
                token = res.body.api_token;                
                var projectsEndPoint = endPoints.projects.projectsEndPoint;
                stories
                    .post(newProject, token, projectsEndPoint, function(res) {
                        expect(res.status).to.equal(status.ok);
                        newProject.project_id = res.body.id;
                        done();
                    });
            });
    });

    after('DELETING THE PROJECT ...', function (done) {            
            storiesEndPoint = storiesEndPoint.replace('/stories', '');            
            stories
                .del(token, storiesEndPoint, function(res) {
                    id = null;
                    done();
                });
    });

    describe('HTTP METHODS for Stories Service', function (){
        it('POST /projects/{project_id}/stories', function (done) {
            storiesEndPoint = storiesEndPoint.replace('{project_id}', newProject.project_id);
            stories
                .post(argument, token, storiesEndPoint, function (res){
                    expect(res.status).to.equal(status.ok);                    
                    expect(res.body.kind).to.equal(crudConfig.postDefault.kind);
                    expect(res.body.story_type).to.equal(crudConfig.postDefault.story_type);
                    expect(res.body.current_state).to.equal(crudConfig.postDefault.current_state);
                    expect(res.body.owner_ids.length).to.equal(crudConfig.postDefault.owner_ids.length);
                    expect(res.body.labels.length).to.equal(crudConfig.postDefault.labels.length);
                    done();
                });
        });
    	it('GET /projects/{project_id}/stories', function (done) {
    		storiesEndPoint = storiesEndPoint.replace('{project_id}', crudConfig.get);
    		stories
    			.get(token, storiesEndPoint, function(res){
    				expect(res.status).to.equal(status.ok);
                    expect(res.body[0].kind).to.equal(crudConfig.postDefault.kind);
                    expect(res.body[0].story_type).to.equal(crudConfig.postDefault.story_type);
                    expect(res.body[0].current_state).to.equal(crudConfig.postDefault.current_state);
                    expect(res.body[0].owner_ids.length).to.equal(crudConfig.postDefault.owner_ids.length);
                    expect(res.body[0].labels.length).to.equal(crudConfig.postDefault.labels.length);
                    done();
    			});
    	});
    });
});