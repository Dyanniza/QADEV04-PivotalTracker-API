//General Lib
/*
@ Author Ronald Butron
@ General Lib
 */

var expect = require('chai').expect;
var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json');
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var type = config.type;
var appJson = config.json;

var post = function(argument, token, endPoint, callback) {

    request
        .post(endPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .set(type, appJson)
        .send(argument)
        .end(function(err, res) {

            if (err) {
                console.log('Error to Create' + JSON.stringify(err));
            } else {
                console.log('-----Created-----' + JSON.stringify(res.body));
            }
            callback(res);
        });
};

exports.post = post;

var put = function(argument, token, endpoint, callback) {
	
	request
        .put(endpoint)
        .proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(argument)
        .end(function(err, res) {

            if (err) {
                console.log('Error to Update' + JSON.stringify(err));
            } else {
                console.log('----Updated-----' + JSON.stringify(res.body));
            }
            callback(res);
        });

}
exports.put = put;

var get = function (token, endPoint, callback) {

		request
			.get(endPoint)
			.proxy(proxy)
			.set(tokenHeader, token)
			.end(function(err, res){
				if (err) {
					console.log('Error to Get'+JSON.stringify(err));
				} else {
					console.log('-----Get-----'+JSON.stringify(res.body));
				}

				callback(res);
			});
}
		
exports.get=get;

var del = function(token, endPoint, callback){
	

	request
		.del(endPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.end(function (err,res) {
			if (err) {
				console.log('Error Deleting......'+JSON.stringify(err));
			} else {
				console.log('-----Deleted-----'+JSON.stringify(res.body));
			}	
			callback(res);		
		});
};

exports.del=del;

