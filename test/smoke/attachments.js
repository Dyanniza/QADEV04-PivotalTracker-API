/*
@author Cecilia Chalar
@class Attachments for Smoke Testing
 */

var expect = require('chai').expect;
var request = require('superagent');
var Chance = require('chance');
var chance = new Chance();
require('superagent-proxy')(request);

var endPoints = require('../../resources/endPoints.json');
var config = require ('../../resources/config.json');
var httpMethod = require ('../../lib/generalLib.js');
var tokenAPI = require ('../../lib/tokenAPI');

var attByIdprjIdEndPoint = endPoints.attachments.attByIdprjIdEndPoint;
var attByIdEpicIdEndPoint = endPoints.attachments.attByIdEpicIdEndPoint;
var attsProjectEndPoint = endPoints.attachments.attsProjectEndPoint;
var projectsEndPoint = endPoints.projects.projectsEndPoint;
var commentsStoryIdEndPoint = endPoints.comments.commentsStoryIdEndPoint;
var attsStoryPrjIdEndPoint = endPoints.attachments.attsStoryPrjIdEndPoint;
var projectByIdEndPoint = endPoints.projects.projectByIdEndPoint;
var storiesEndPoint = endPoints.stories.storiesEndPoint;

var userCredentials = config.userCredential;
var status = config.status;

var token = null;
var projectId = null;
var storyId = null;
var commentId = null;
var attachmentId = null;

describe('Suite attachments smoke test',function (){
    this.timeout(10000);

    before('Get Token', function (done) {
      tokenAPI
        .getToken(userCredentials, function (res) {
            expect(res.status).to.equal(status.ok);
            token = res.body.api_token;                
            done();                
        });
    });   

    beforeEach('Creating Pre Conditions at least a project', function (done) {
    var projectName = { name : chance.string()};
    var storyName = { name: chance.string()};
    var commtContain = { text : chance.sentence({words: 6})}

        httpMethod

            .post(projectName, token, projectsEndPoint,  function(res) {
                expect(res.status).to.equal(status.ok);
                projectId = res.body.id;
                endPoint = storiesEndPoint.replace('{project_id}', projectId );
                    
                    httpMethod
                    .post(storyName, token, endPoint, function(res) {
                        storyId = res.body.id;
                        endPoint = commentsStoryIdEndPoint.replace('{project_id}', projectId )
                                                          .replace('{story_id}', storyId);
                        
                        httpMethod
                            .post(commtContain, token, endPoint, function(res) {
                                expect(res.status).to.equal(status.ok);
                                commentId = res.body.id;
                                endPoint = attsStoryPrjIdEndPoint.replace('{project_id}', projectId)
                                                                 .replace('{story_id}', storyId)
                                                                 .replace('{comment_id}', commentId);
                                
                                done();
                            });
                    });
            });
    });

    afterEach('Deleting project....', function (done) {
        endPoint = projectByIdEndPoint.replace('{project_id}', projectId );
        httpMethod
            .del(token, endPoint, function(res) {
                expect(res.status).to.equal(status.noContent);
                projectId = null;
                storyId = null;
                enPoint = null;
                done();
            });
    });

        
    it('DELETE /projects/{project_id}/stories/{story_id}/comments/{comment_id}/file_attachments',function(done){
    var endPoint = attsStoryPrjIdEndPoint.replace('{project_id}', projectId)
                                                                 .replace('{story_id}', storyId)
                                                                 .replace('{comment_id}', commentId);               
        httpMethod            
                
            .del(token,endPoint,function(res){
                expect(res.status).to.equal(status.notFound);
                done();
            });            
    });

    it('DELETE /projects/{project_id}/stories/{story_id}/comments/{comment_id}/file_attachments/file_attachments_id',function(done){
    var endPoint = attsStoryPrjIdEndPoint.replace('{project_id}', projectId)
                                                                 .replace('{story_id}', storyId)
                                                                 .replace('{comment_id}', commentId)
                                                                 .replace('{file_attachments_id}',attachmentId);              
        httpMethod            
                
            .del(token,endPoint,function(res){
                expect(res.status).to.equal(status.notFound);
                done();
            });            
    });

    it('POST /projects/{project_id}/uploads',function(done){
    var endPoint = attsProjectEndPoint.replace('{project_id}', projectId);
    var contain = {
      file:'@$FILE_PATH',
      file_attachment_ids_to_add:['21']
    };
                                                                              
        httpMethod            
                
            .del(token,endPoint,function(res){
                expect(res.status).to.equal(status.notFound);
                done();
            });            
    });
});
