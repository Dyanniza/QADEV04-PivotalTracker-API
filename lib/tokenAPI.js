/*
@author Jhasmany Quiroz
@Class tokenAPI
 */

var request = require('superagent');
require('superagent-proxy')(request);
var config = require('../resources/config');
var endPoints = require('../resources/endPoints');

var proxy = config.proxy;
var tokenEndPoint = endPoints.me.meEndPoint;
var tokenHeader = config.tokenHeader;

/**
 * @param  {Credentials of User}
 * @param  {Function that will receive the request}
 * @return {Callback that return the request}
 */
var getToken = function (userCredentialJSON, callback) {
	console.log('TOKEN-API: ... Getting token for ... ' + userCredentialJSON.userAccount);
	request
		.get(tokenEndPoint)
		.proxy(proxy)
		.auth(userCredentialJSON.userAccount, userCredentialJSON.userPassword)
	.end (function (err,res) {
			if(err) {
					console.log('Error when getting the token ...' + JSON.stringify(res.body));
			} else {
					console.log('Token ...' + res.body.api_token);
			};
   callback(res);
	});
};

exports.getToken = getToken;