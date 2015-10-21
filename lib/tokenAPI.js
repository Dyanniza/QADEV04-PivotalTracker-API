/*
@author Jhasmany Quiroz
@class tokenAPI
 */

var request = require('superagent');
require('superagent-proxy')(request);

var config = require('..//config');

var proxy = config.proxy;
var tokenEndPoint = 'https://www.pivotaltracker.com/services/v5/me';
var tokenHeader = 'X-TrackerToken';

/**
 * @param  {Credentials of User}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getToken = function(userCredentialJSON, callback){
	console.log('Getting token for ...' + userCredentialJSON.userAccount);
	request
		.get(tokenEndPoint)
		.proxy(proxy)		
		.auth(userCredentialJSON.userAccount, userCredentialJSON.userPassword)
	.end(function(err,res){		
		if(err) {
			console.log('Error when getting the token...' + JSON.stringify(res.body));
		}
		else{
			console.log('Token object...' + JSON.stringify(res.body));
			console.log('Token...' + res.body.api_token);
		}
		callback(res);
	});
};

exports.getToken = getToken;